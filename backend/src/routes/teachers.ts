import express from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";
import {
  updateTeacherProfileSchema,
  updateTeacherSettingsSchema,
} from "../validators/teacherValidators";

const router = express.Router();

// Get teacher profile
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          phone: true,
          emailVerified: true,
          phoneVerified: true,
        },
      },
      subjectOfferings: {
        where: { deletedAt: null },
        orderBy: { orderIndex: "asc" },
      },
      teacherChips: true,
      _count: {
        select: {
          reviews: true,
          bookings: {
            where: { status: "COMPLETED" },
          },
        },
      },
    },
  });

  if (!teacher) {
    throw new AppError("Teacher profile not found", 404, "TEACHER_NOT_FOUND");
  }

  // Calculate profile completion percentage
  const profileCompletion = calculateProfileCompletion(teacher);

  res.json({
    ...teacher,
    profileCompletion,
  });
});

// Update teacher profile
router.put(
  "/profile",
  authMiddleware,
  validateRequest(updateTeacherProfileSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const {
      firstName,
      lastName,
      bioUz,
      bioRu,
      bioEn,
      experienceYears,
      education,
      certificates,
      languagesTaught,
      languagesSpoken,
      cancellationPolicy,
      minNoticeHours,
      maxAdvanceDays,
      timezone,
    } = req.body;

    // Check if teacher profile exists
    const existingProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new AppError("Teacher profile not found", 404, "TEACHER_NOT_FOUND");
    }

    const updatedProfile = await prisma.teacherProfile.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        bioUz,
        bioRu,
        bioEn,
        experienceYears,
        education,
        certificates,
        languagesTaught,
        languagesSpoken,
        cancellationPolicy,
        minNoticeHours,
        maxAdvanceDays,
        timezone,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            emailVerified: true,
            phoneVerified: true,
          },
        },
        subjectOfferings: {
          where: { deletedAt: null },
          orderBy: { orderIndex: "asc" },
        },
        teacherChips: true,
      },
    });

    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(updatedProfile);

    logger.info("Teacher profile updated", {
      teacherId: existingProfile.id,
      userId,
      updatedFields: Object.keys(req.body),
    });

    res.json({
      ...updatedProfile,
      profileCompletion,
    });
  }
);

// Update teacher settings
router.put(
  "/settings",
  authMiddleware,
  validateRequest(updateTeacherSettingsSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { isActive, timezone } = req.body;

    const updatedProfile = await prisma.teacherProfile.update({
      where: { userId },
      data: {
        isActive,
        timezone,
        updatedAt: new Date(),
      },
    });

    logger.info("Teacher settings updated", {
      teacherId: updatedProfile.id,
      userId,
      isActive,
      timezone,
    });

    res.json(updatedProfile);
  }
);

// Upload profile avatar
router.post("/upload-avatar", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { avatar } = req.body;

  if (!avatar) {
    throw new AppError("Avatar URL is required", 400, "AVATAR_REQUIRED");
  }

  const updatedProfile = await prisma.teacherProfile.update({
    where: { userId },
    data: {
      avatar,
      updatedAt: new Date(),
    },
  });

  logger.info("Teacher avatar updated", {
    teacherId: updatedProfile.id,
    userId,
  });

  res.json({ avatar: updatedProfile.avatar });
});

// Upload video introduction
router.post("/upload-video", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { videoIntroUrl } = req.body;

  if (!videoIntroUrl) {
    throw new AppError("Video URL is required", 400, "VIDEO_URL_REQUIRED");
  }

  const updatedProfile = await prisma.teacherProfile.update({
    where: { userId },
    data: {
      videoIntroUrl,
      updatedAt: new Date(),
    },
  });

  logger.info("Teacher video introduction updated", {
    teacherId: updatedProfile.id,
    userId,
  });

  res.json({ videoIntroUrl: updatedProfile.videoIntroUrl });
});

// Get teacher statistics
router.get("/stats", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacher) {
    throw new AppError("Teacher profile not found", 404, "TEACHER_NOT_FOUND");
  }

  // Get detailed statistics
  const [
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
    averageRating,
    totalEarnings,
    availableEarnings,
    thisMonthBookings,
    thisMonthEarnings,
  ] = await Promise.all([
    prisma.booking.count({
      where: { teacherId: teacher.id },
    }),
    prisma.booking.count({
      where: { teacherId: teacher.id, status: "COMPLETED" },
    }),
    prisma.booking.count({
      where: { teacherId: teacher.id, status: "CANCELLED" },
    }),
    prisma.review.count({
      where: { teacherId: teacher.id, status: "APPROVED" },
    }),
    prisma.review.aggregate({
      where: { teacherId: teacher.id, status: "APPROVED" },
      _avg: { rating: true },
    }),
    prisma.walletEntry.aggregate({
      where: { teacherId: teacher.id },
      _sum: { amount: true },
    }),
    prisma.walletEntry.aggregate({
      where: { teacherId: teacher.id, status: "AVAILABLE" },
      _sum: { amount: true },
    }),
    prisma.booking.count({
      where: {
        teacherId: teacher.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.walletEntry.aggregate({
      where: {
        teacherId: teacher.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const stats = {
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
    averageRating: averageRating._avg.rating || 0,
    totalEarnings: totalEarnings._sum.amount || 0,
    availableEarnings: availableEarnings._sum.amount || 0,
    thisMonthBookings,
    thisMonthEarnings: thisMonthEarnings._sum.amount || 0,
    completionRate:
      totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
    cancellationRate:
      totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0,
  };

  res.json(stats);
});

// Update teacher chips/specializations
router.put("/chips", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { teachingLevels, examPreparation } = req.body;

  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacher) {
    throw new AppError("Teacher profile not found", 404, "TEACHER_NOT_FOUND");
  }

  // Upsert teacher chips
  const chips = await prisma.teacherChips.upsert({
    where: { teacherId: teacher.id },
    update: {
      teachingLevels: teachingLevels || [],
      examPreparation: examPreparation || [],
      updatedAt: new Date(),
    },
    create: {
      teacherId: teacher.id,
      teachingLevels: teachingLevels || [],
      examPreparation: examPreparation || [],
    },
  });

  logger.info("Teacher chips updated", {
    teacherId: teacher.id,
    userId,
    teachingLevels,
    examPreparation,
  });

  res.json(chips);
});

// Helper function to calculate profile completion
function calculateProfileCompletion(teacher: any): number {
  let completed = 0;
  const total = 15; // Total number of profile fields to check

  // Basic info (5 points)
  if (teacher.firstName) completed++;
  if (teacher.lastName) completed++;
  if (teacher.bioUz || teacher.bioRu || teacher.bioEn) completed++;
  if (teacher.experienceYears > 0) completed++;
  if (teacher.timezone) completed++;

  // Media (2 points)
  if (teacher.avatar) completed++;
  if (teacher.videoIntroUrl) completed++;

  // Professional info (4 points)
  if (teacher.education && teacher.education.length > 0) completed++;
  if (teacher.certificates && teacher.certificates.length > 0) completed++;
  if (teacher.languagesTaught && teacher.languagesTaught.length > 0) completed++;
  if (teacher.languagesSpoken && teacher.languagesSpoken.length > 0) completed++;

  // Subjects and pricing (2 points)
  if (teacher.subjectOfferings && teacher.subjectOfferings.length > 0) completed++;
  if (teacher.teacherChips) completed++;

  // Settings (2 points)
  if (teacher.cancellationPolicy) completed++;
  if (teacher.minNoticeHours > 0) completed++;

  return Math.round((completed / total) * 100);
}

export default router;
