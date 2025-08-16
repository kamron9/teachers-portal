import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
    sessionId: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError("Authentication token required", 401, "UNAUTHORIZED");
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(
          "Authentication token expired",
          401,
          "TOKEN_EXPIRED",
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(
          "Invalid authentication token",
          401,
          "INVALID_TOKEN",
        );
      }
      throw new AppError("Authentication failed", 401, "UNAUTHORIZED");
    }

    // Check if session exists and is valid
    const session = await prisma.userSession.findUnique({
      where: {
        token: token,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            phoneVerified: true,
          },
        },
      },
    });

    if (!session) {
      throw new AppError(
        "Session not found or expired",
        401,
        "SESSION_INVALID",
      );
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      // Mark session as inactive
      await prisma.userSession.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new AppError("Session expired", 401, "SESSION_EXPIRED");
    }

    // Check if user account is active
    if (session.user.status !== "ACTIVE") {
      throw new AppError("Account is not active", 403, "ACCOUNT_INACTIVE");
    }

    // Update last used timestamp
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    // Attach user info to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      status: session.user.status,
      sessionId: session.id,
    };

    logger.info("User authenticated", {
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role,
      sessionId: req.user.sessionId,
      ip: req.ip,
    });

    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn("Insufficient permissions", {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        endpoint: req.path,
      });

      throw new AppError(
        "Insufficient permissions",
        403,
        "INSUFFICIENT_PERMISSIONS",
      );
    }

    next();
  };
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    // Try to verify token, but don't fail if invalid
    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      const session = await prisma.userSession.findUnique({
        where: {
          token: token,
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      if (
        session &&
        session.expiresAt > new Date() &&
        session.user.status === "ACTIVE"
      ) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          status: session.user.status,
          sessionId: session.id,
        };
      }
    } catch (error) {
      // Ignore authentication errors for optional auth
      logger.debug("Optional auth failed", { error: error instanceof Error ? error.message : String(error) });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Verification middleware
export const requireVerification = (type: "email" | "phone" | "teacher") => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          teacherProfile: type === "teacher",
        },
      });

      if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      if (type === "email" && !user.emailVerified) {
        throw new AppError(
          "Email verification required",
          403,
          "EMAIL_VERIFICATION_REQUIRED",
        );
      }

      if (type === "phone" && !user.phoneVerified) {
        throw new AppError(
          "Phone verification required",
          403,
          "PHONE_VERIFICATION_REQUIRED",
        );
      }

      if (type === "teacher") {
        if (user.role !== "TEACHER") {
          throw new AppError(
            "Teacher account required",
            403,
            "TEACHER_ACCOUNT_REQUIRED",
          );
        }

        if (
          !user.teacherProfile ||
          user.teacherProfile.verificationStatus !== "APPROVED"
        ) {
          throw new AppError(
            "Teacher verification required",
            403,
            "TEACHER_VERIFICATION_REQUIRED",
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
