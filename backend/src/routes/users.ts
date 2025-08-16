import express from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";

const router = express.Router();

// Get current user profile
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      emailVerified: true,
      phoneVerified: true,
      emailConsent: true,
      smsConsent: true,
      twoFactorEnabled: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      studentProfile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          timezone: true,
          preferredLanguages: true,
        },
      },
      teacherProfile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          verificationStatus: true,
          isActive: true,
          rating: true,
          totalReviews: true,
          totalLessons: true,
          timezone: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  res.json(user);
});

// Update user preferences
router.put("/preferences", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { emailConsent, smsConsent, timezone, preferredLanguages } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      emailConsent: emailConsent !== undefined ? emailConsent : undefined,
      smsConsent: smsConsent !== undefined ? smsConsent : undefined,
    },
    select: {
      id: true,
      emailConsent: true,
      smsConsent: true,
    },
  });

  // Update profile-specific preferences
  if (req.user!.role === "STUDENT" && (timezone || preferredLanguages)) {
    await prisma.studentProfile.update({
      where: { userId },
      data: {
        timezone: timezone || undefined,
        preferredLanguages: preferredLanguages || undefined,
      },
    });
  }

  if (req.user!.role === "TEACHER" && timezone) {
    await prisma.teacherProfile.update({
      where: { userId },
      data: {
        timezone: timezone || undefined,
      },
    });
  }

  logger.info("User preferences updated", {
    userId,
    emailConsent,
    smsConsent,
    timezone,
    preferredLanguages,
  });

  res.json(updatedUser);
});

// Delete user account (soft delete)
router.delete("/account", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  // Check for active bookings
  const activeBookings = await prisma.booking.count({
    where: {
      OR: [
        { studentId: req.user!.id },
        { teacherId: req.user!.id },
      ],
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      startAt: {
        gte: new Date(),
      },
    },
  });

  if (activeBookings > 0) {
    throw new AppError(
      "Cannot delete account with active bookings",
      400,
      "ACTIVE_BOOKINGS_EXIST"
    );
  }

  // Soft delete user
  await prisma.user.update({
    where: { id: userId },
    data: {
      status: "DELETED",
      deletedAt: new Date(),
      email: `deleted_${userId}_${Date.now()}@deleted.com`,
      phone: null,
    },
  });

  // Invalidate all sessions
  await prisma.userSession.updateMany({
    where: { userId },
    data: { isActive: false },
  });

  logger.info("User account deleted", { userId });

  res.json({ message: "Account deleted successfully" });
});

export default router;
