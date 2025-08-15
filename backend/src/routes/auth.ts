import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { logger } from "../utils/logger";
import { AppError, ValidationError } from "../utils/errors";
import { validateRequest } from "../middleware/validation";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { sendEmail } from "../services/emailService";
import { sendSMS } from "../services/smsService";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  changePasswordSchema,
} from "../validators/authValidators";

const router = express.Router();

// Register new user
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  const { email, phone, password, role, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });

  if (existingUser) {
    throw new AppError(
      "User already exists with this email or phone",
      409,
      "USER_ALREADY_EXISTS",
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    config.security.bcryptRounds,
  );

  // Create user and profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        role,
        emailVerified: !config.verification.requireEmailVerification,
        phoneVerified: !config.verification.requirePhoneVerification,
      },
    });

    // Create appropriate profile
    if (role === "STUDENT") {
      await tx.studentProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });
    } else if (role === "TEACHER") {
      await tx.teacherProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          verificationStatus: config.verification.teacherAutoApproval
            ? "APPROVED"
            : "PENDING",
        },
      });
    }

    return user;
  });

  // Send verification emails/SMS if required
  if (config.verification.requireEmailVerification) {
    await sendVerificationEmail(result.id, email);
  }

  if (config.verification.requirePhoneVerification && phone) {
    await sendVerificationSMS(result.id, phone);
  }

  logger.info("User registered", {
    userId: result.id,
    email,
    role,
    emailVerificationRequired: config.verification.requireEmailVerification,
    phoneVerificationRequired:
      config.verification.requirePhoneVerification && !!phone,
  });

  res.status(201).json({
    message: "User registered successfully",
    userId: result.id,
    verificationRequired: {
      email: config.verification.requireEmailVerification,
      phone: config.verification.requirePhoneVerification && !!phone,
    },
  });
});

// Login user
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  // Check account status
  if (user.status !== "ACTIVE") {
    throw new AppError("Account is not active", 403, "ACCOUNT_INACTIVE");
  }

  // Check email verification if required
  if (config.verification.requireEmailVerification && !user.emailVerified) {
    throw new AppError(
      "Email verification required",
      403,
      "EMAIL_VERIFICATION_REQUIRED",
    );
  }

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const refreshToken = jwt.sign(tokenPayload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  // Create session
  const expiresAt = new Date();
  expiresAt.setTime(
    expiresAt.getTime() +
      (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
  );

  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info("User logged in", {
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      profile:
        user.role === "STUDENT" ? user.studentProfile : user.teacherProfile,
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresAt,
    },
  });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 400, "REFRESH_TOKEN_REQUIRED");
  }

  // Verify refresh token
  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  // Find session
  const session = await prisma.userSession.findFirst({
    where: {
      refreshToken,
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    throw new AppError("Session expired or invalid", 401, "SESSION_EXPIRED");
  }

  // Generate new tokens
  const tokenPayload = {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role,
  };

  const newAccessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const newRefreshToken = jwt.sign(tokenPayload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  // Update session
  await prisma.userSession.update({
    where: { id: session.id },
    data: {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      lastUsedAt: new Date(),
    },
  });

  logger.info("Token refreshed", {
    userId: session.user.id,
    sessionId: session.id,
  });

  res.json({
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: session.expiresAt,
    },
  });
});

// Logout
router.post("/logout", authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.sessionId) {
    await prisma.userSession.update({
      where: { id: req.user.sessionId },
      data: { isActive: false },
    });

    logger.info("User logged out", {
      userId: req.user.id,
      sessionId: req.user.sessionId,
    });
  }

  res.json({ message: "Logged out successfully" });
});

// Logout from all devices
router.post("/logout-all", authMiddleware, async (req: AuthRequest, res) => {
  await prisma.userSession.updateMany({
    where: {
      userId: req.user!.id,
      isActive: true,
    },
    data: { isActive: false },
  });

  logger.info("User logged out from all devices", { userId: req.user!.id });

  res.json({ message: "Logged out from all devices successfully" });
});

// Forgot password
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      res.json({ message: "If the email exists, a reset link has been sent" });
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      config.jwtSecret,
      { expiresIn: "1h" },
    );

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    logger.info("Password reset requested", { userId: user.id, email });

    res.json({ message: "If the email exists, a reset link has been sent" });
  },
);

// Reset password
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  async (req, res) => {
    const { token, newPassword } = req.body;

    // Verify reset token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new AppError(
        "Invalid or expired reset token",
        400,
        "INVALID_RESET_TOKEN",
      );
    }

    if (decoded.type !== "password_reset") {
      throw new AppError("Invalid token type", 400, "INVALID_TOKEN_TYPE");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.security.bcryptRounds,
    );

    // Update password and invalidate all sessions
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      await tx.userSession.updateMany({
        where: { userId: decoded.userId },
        data: { isActive: false },
      });
    });

    logger.info("Password reset completed", { userId: decoded.userId });

    res.json({ message: "Password reset successfully" });
  },
);

// Verify email
router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  async (req, res) => {
    const { token } = req.body;

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new AppError(
        "Invalid or expired verification token",
        400,
        "INVALID_VERIFICATION_TOKEN",
      );
    }

    if (decoded.type !== "email_verification") {
      throw new AppError("Invalid token type", 400, "INVALID_TOKEN_TYPE");
    }

    // Update user
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true },
    });

    logger.info("Email verified", { userId: decoded.userId });

    res.json({ message: "Email verified successfully" });
  },
);

// Resend email verification
router.post(
  "/resend-email-verification",
  authMiddleware,
  async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.emailVerified) {
      throw new AppError(
        "Email already verified",
        400,
        "EMAIL_ALREADY_VERIFIED",
      );
    }

    await sendVerificationEmail(user.id, user.email);

    logger.info("Email verification resent", { userId: user.id });

    res.json({ message: "Verification email sent" });
  },
);

// Change password
router.post(
  "/change-password",
  authMiddleware,
  validateRequest(changePasswordSchema),
  async (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new AppError(
        "Current password is incorrect",
        400,
        "INVALID_CURRENT_PASSWORD",
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      config.security.bcryptRounds,
    );

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    logger.info("Password changed", { userId: user.id });

    res.json({ message: "Password changed successfully" });
  },
);

// Helper functions
const sendVerificationEmail = async (userId: string, email: string) => {
  const token = jwt.sign(
    { userId, type: "email_verification" },
    config.jwtSecret,
    { expiresIn: "24h" },
  );

  const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    template: "email-verification",
    data: {
      verificationUrl,
    },
  });
};

const sendVerificationSMS = async (userId: string, phone: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in cache/database for verification
  // Implementation depends on your OTP storage strategy

  await sendSMS({
    to: phone,
    message: `Your verification code is: ${otp}. Valid for 10 minutes.`,
  });
};

const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    template: "password-reset",
    data: {
      resetUrl,
    },
  });
};

export default router;
