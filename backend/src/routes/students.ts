import express from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";
import { updateStudentProfileSchema } from "../validators/studentValidators";

const router = express.Router();

// Get student profile
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const student = await prisma.studentProfile.findUnique({
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
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404, "STUDENT_NOT_FOUND");
  }

  res.json(student);
});

// Update student profile
router.put(
  "/profile",
  authMiddleware,
  validateRequest(updateStudentProfileSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { firstName, lastName, avatar, timezone, preferredLanguages } = req.body;

    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        avatar,
        timezone,
        preferredLanguages,
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
      },
    });

    logger.info("Student profile updated", {
      studentId: updatedProfile.id,
      userId,
      updatedFields: Object.keys(req.body),
    });

    res.json(updatedProfile);
  }
);

// Get student bookings
router.get("/bookings", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { 
    status, 
    type, 
    limit = 20, 
    offset = 0 
  } = req.query;

  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404, "STUDENT_NOT_FOUND");
  }

  const whereClause: any = {
    studentId: student.id,
  };

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
          },
        },
        subjectOffering: {
          select: {
            subjectName: true,
            level: true,
            icon: true,
          },
        },
        package: {
          select: {
            lessonsTotal: true,
            lessonsRemaining: true,
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
      orderBy: { startAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    }),
    prisma.booking.count({ where: whereClause }),
  ]);

  res.json({
    bookings,
    totalCount,
    hasMore: Number(offset) + Number(limit) < totalCount,
  });
});

// Get student statistics
router.get("/stats", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404, "STUDENT_NOT_FOUND");
  }

  const [
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalSpent,
    thisMonthBookings,
    activePackages,
  ] = await Promise.all([
    prisma.booking.count({
      where: { studentId: student.id },
    }),
    prisma.booking.count({
      where: { studentId: student.id, status: "COMPLETED" },
    }),
    prisma.booking.count({
      where: { studentId: student.id, status: "CANCELLED" },
    }),
    prisma.payment.aggregate({
      where: {
        OR: [
          { booking: { studentId: student.id } },
          { package: { studentId: student.id } },
        ],
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
    prisma.booking.count({
      where: {
        studentId: student.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.package.count({
      where: {
        studentId: student.id,
        lessonsRemaining: { gt: 0 },
        expiresAt: { gte: new Date() },
      },
    }),
  ]);

  const stats = {
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalSpent: totalSpent._sum.amount || 0,
    thisMonthBookings,
    activePackages,
    completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
  };

  res.json(stats);
});

// Get student reviews given
router.get("/reviews", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { limit = 10, offset = 0 } = req.query;

  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404, "STUDENT_NOT_FOUND");
  }

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where: { studentId: student.id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        booking: {
          select: {
            startAt: true,
            subjectOffering: {
              select: {
                subjectName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    }),
    prisma.review.count({ where: { studentId: student.id } }),
  ]);

  res.json({
    reviews,
    totalCount,
    hasMore: Number(offset) + Number(limit) < totalCount,
  });
});

export default router;
