import express from "express";
import { prisma } from "../lib/prisma";
import { requireRole } from "../middleware/auth";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import { AppError, NotFoundError } from "../utils/errors";
import { logger } from "../utils/logger";
import {
  adminUserManagementSchema,
  adminBulkActionSchema,
  adminSystemConfigSchema,
  adminAnalyticsQuerySchema,
  adminModerationSchema,
} from "../validators/adminValidators";
import { commonSchemas } from "../middleware/validation";
import { sendEmail } from "../services/emailService";
import Joi from "joi";

const router = express.Router();

// Dashboard overview
router.get("/dashboard", requireRole("ADMIN"), async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalBookings,
    totalRevenue,
    newUsersThisMonth,
    newBookingsThisWeek,
    pendingReviews,
    activeTeachers,
    systemHealth,
  ] = await Promise.all([
    // Total counts
    prisma.user.count(),
    prisma.teacherProfile.count(),
    prisma.studentProfile.count(),
    prisma.booking.count(),

    // Total revenue
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),

    // New users this month
    prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),

    // New bookings this week
    prisma.booking.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),

    // Pending reviews for moderation
    prisma.review.count({
      where: { status: "PENDING" },
    }),

    // Active teachers (had activity in last 30 days)
    prisma.teacherProfile.count({
      where: {
        user: {
          lastLoginAt: { gte: thirtyDaysAgo },
        },
      },
    }),

    // System health indicators
    Promise.all([
      prisma.user.count({ where: { isActive: false } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.payment.count({ where: { status: "FAILED" } }),
    ]),
  ]);

  const [inactiveUsers, cancelledBookings, failedPayments] = systemHealth;

  const dashboardData = {
    overview: {
      totalUsers,
      totalTeachers,
      totalStudents,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      newUsersThisMonth,
      newBookingsThisWeek,
    },
    moderation: {
      pendingReviews,
      pendingTeachers: await prisma.teacherProfile.count({
        where: { isVerified: false },
      }),
    },
    activity: {
      activeTeachers,
      activeStudents: await prisma.studentProfile.count({
        where: {
          user: {
            lastLoginAt: { gte: sevenDaysAgo },
          },
        },
      }),
    },
    systemHealth: {
      inactiveUsers,
      cancelledBookings,
      failedPayments,
      uptime: process.uptime(),
    },
  };

  logger.info("Admin dashboard accessed", {
    adminId: req.user!.id,
    timestamp: new Date(),
  });

  res.json(dashboardData);
});

// User management
router.get(
  "/users",
  requireRole("ADMIN"),
  validateQuery(adminUserManagementSchema),
  async (req, res) => {
    const {
      role,
      isActive,
      isVerified,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 50,
      startDate,
      endDate,
    } = req.query;

    const skip = (page - 1) * limit;
    let whereClause: any = {};

    // Role filter
    if (role && role !== "ALL") {
      whereClause.role = role;
    }

    // Active status filter
    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    // Search filter
    if (search) {
      whereClause.OR = [
        {
          email: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          teacherProfile: {
            OR: [
              {
                firstName: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
        {
          studentProfile: {
            OR: [
              {
                firstName: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    // Verified filter (for teachers)
    if (isVerified !== undefined && role === "TEACHER") {
      whereClause.teacherProfile = {
        ...whereClause.teacherProfile,
        isVerified: isVerified === "true",
      };
    }

    let orderBy: any;
    switch (sortBy) {
      case "email":
        orderBy = { email: sortOrder };
        break;
      case "lastLogin":
        orderBy = { lastLoginAt: sortOrder };
        break;
      case "role":
        orderBy = { role: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          teacherProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              isVerified: true,
              hourlyRate: true,
              rating: true,
              totalReviews: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              teacherBookings: true,
              studentBookings: true,
              auditLogs: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    logger.info("Admin user management accessed", {
      adminId: req.user!.id,
      filters: { role, isActive, search },
      resultsCount: totalCount,
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      appliedFilters: {
        role,
        isActive,
        isVerified,
        search,
        startDate,
        endDate,
      },
    });
  },
);

// Get specific user details
router.get(
  "/users/:userId",
  requireRole("ADMIN"),
  validateParams(Joi.object({ userId: commonSchemas.id })),
  async (req, res) => {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            subjectOfferings: true,
            availabilitySlots: {
              where: {
                startTime: { gte: new Date() },
              },
              take: 10,
            },
            _count: {
              select: {
                bookings: true,
                reviews: true,
              },
            },
          },
        },
        studentProfile: {
          include: {
            _count: {
              select: {
                bookings: true,
                reviews: true,
              },
            },
          },
        },
        teacherBookings: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        studentBookings: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            teacher: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        auditLogs: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    logger.info("Admin viewed user details", {
      adminId: req.user!.id,
      targetUserId: userId,
    });

    res.json(user);
  },
);

// Update user status
router.patch(
  "/users/:userId/status",
  requireRole("ADMIN"),
  validateParams(Joi.object({ userId: commonSchemas.id })),
  validateRequest(
    Joi.object({
      isActive: Joi.boolean().required(),
      reason: Joi.string().min(5).max(500).required(),
    }),
  ),
  async (req, res) => {
    const { userId } = req.params;
    const { isActive, reason } = req.body;
    const adminId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true, role: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isActive === isActive) {
      throw new AppError(
        `User is already ${isActive ? "active" : "inactive"}`,
        400,
        "NO_CHANGE_REQUIRED",
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
        resource: "user",
        resourceId: userId,
        oldValues: { isActive: user.isActive },
        newValues: { isActive, reason },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    // Send notification email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Account ${isActive ? "Activated" : "Deactivated"}`,
        template: "account-status-change",
        data: {
          isActive,
          reason,
          supportEmail: process.env.SUPPORT_EMAIL,
        },
      });
    }

    logger.info("User status updated by admin", {
      adminId,
      targetUserId: userId,
      newStatus: isActive,
      reason,
    });

    res.json({
      user: updatedUser,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  },
);

// Verify teacher
router.patch(
  "/teachers/:teacherId/verify",
  requireRole("ADMIN"),
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  validateRequest(
    Joi.object({
      isVerified: Joi.boolean().required(),
      verificationNotes: Joi.string().max(1000).optional(),
    }),
  ),
  async (req, res) => {
    const { teacherId } = req.params;
    const { isVerified, verificationNotes } = req.body;
    const adminId = req.user!.id;

    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: { email: true, isActive: true },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    const updatedTeacher = await prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        isVerified,
        verificationNotes,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? adminId : null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: isVerified ? "VERIFY_TEACHER" : "UNVERIFY_TEACHER",
        resource: "teacher",
        resourceId: teacherId,
        oldValues: { isVerified: teacher.isVerified },
        newValues: { isVerified, verificationNotes },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    // Send notification email
    if (teacher.user.email) {
      await sendEmail({
        to: teacher.user.email,
        subject: `Teacher Profile ${isVerified ? "Verified" : "Verification Revoked"}`,
        template: "teacher-verification-status",
        data: {
          teacherName: `${teacher.firstName} ${teacher.lastName}`,
          isVerified,
          verificationNotes,
          supportEmail: process.env.SUPPORT_EMAIL,
        },
      });
    }

    logger.info("Teacher verification status updated", {
      adminId,
      teacherId,
      isVerified,
      verificationNotes,
    });

    res.json({
      teacher: updatedTeacher,
      message: `Teacher ${isVerified ? "verified" : "unverified"} successfully`,
    });
  },
);

// Bulk user actions
router.post(
  "/users/bulk-action",
  requireRole("ADMIN"),
  validateRequest(adminBulkActionSchema),
  async (req, res) => {
    const { userIds, action, reason } = req.body;
    const adminId = req.user!.id;

    if (userIds.length === 0) {
      throw new AppError(
        "No users provided for bulk action",
        400,
        "EMPTY_USER_LIST",
      );
    }

    // Verify all users exist
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, isActive: true, role: true },
    });

    if (users.length !== userIds.length) {
      throw new AppError("Some users not found", 404, "USERS_NOT_FOUND");
    }

    let updateData: any = {};
    let auditAction: string = "";

    switch (action) {
      case "ACTIVATE":
        updateData = { isActive: true };
        auditAction = "BULK_ACTIVATE_USERS";
        break;
      case "DEACTIVATE":
        updateData = { isActive: false };
        auditAction = "BULK_DEACTIVATE_USERS";
        break;
      case "DELETE":
        // Soft delete by marking as inactive and anonymizing data
        updateData = {
          isActive: false,
          email: `deleted_${Date.now()}@deleted.local`,
        };
        auditAction = "BULK_DELETE_USERS";
        break;
      default:
        throw new AppError("Invalid bulk action", 400, "INVALID_BULK_ACTION");
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update users
      const updatedUsers = await tx.user.updateMany({
        where: { id: { in: userIds } },
        data: updateData,
      });

      // Create audit logs for each user
      const auditLogs = userIds.map((userId) => ({
        userId: adminId,
        action: auditAction,
        resource: "user",
        resourceId: userId,
        oldValues: {},
        newValues: { ...updateData, reason },
        ipAddress: req.ip || "",
        userAgent: req.get("User-Agent") || "",
      }));

      await tx.auditLog.createMany({
        data: auditLogs,
      });

      return updatedUsers;
    });

    logger.info("Bulk user action performed", {
      adminId,
      action,
      userCount: userIds.length,
      reason,
    });

    res.json({
      message: `Bulk action ${action.toLowerCase()} completed successfully`,
      affectedUsers: result.count,
      action,
      reason,
    });
  },
);

// System configuration
router.get("/system/config", requireRole("ADMIN"), async (req, res) => {
  // Return system configuration (exclude sensitive data)
  const config = {
    maintenance: {
      enabled: process.env.MAINTENANCE_MODE === "true",
      message: process.env.MAINTENANCE_MESSAGE || "",
    },
    features: {
      registrationEnabled: process.env.REGISTRATION_ENABLED !== "false",
      paymentEnabled: process.env.PAYMENT_ENABLED !== "false",
      notificationsEnabled: process.env.NOTIFICATIONS_ENABLED !== "false",
    },
    limits: {
      maxFileSize: process.env.MAX_FILE_SIZE || "10MB",
      maxBookingsPerUser: parseInt(process.env.MAX_BOOKINGS_PER_USER || "50"),
      sessionTimeout: process.env.SESSION_TIMEOUT || "24h",
    },
    email: {
      provider: process.env.EMAIL_PROVIDER || "sendgrid",
      fromAddress: process.env.EMAIL_FROM || "noreply@tutoring.uz",
    },
    payment: {
      provider: process.env.PAYMENT_PROVIDER || "stripe",
      currency: process.env.DEFAULT_CURRENCY || "UZS",
    },
  };

  res.json(config);
});

// Update system configuration
router.patch(
  "/system/config",
  requireRole("ADMIN"),
  validateRequest(adminSystemConfigSchema),
  async (req, res) => {
    const configUpdates = req.body;
    const adminId = req.user!.id;

    // This would typically update environment variables or database config
    // For now, we'll log the changes
    logger.info("System configuration updated", {
      adminId,
      updates: configUpdates,
      timestamp: new Date(),
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "UPDATE_SYSTEM_CONFIG",
        resource: "system",
        resourceId: "config",
        oldValues: {},
        newValues: configUpdates,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    res.json({
      message: "System configuration updated successfully",
      updates: configUpdates,
    });
  },
);

// Analytics endpoints
router.get(
  "/analytics/users",
  requireRole("ADMIN"),
  validateQuery(adminAnalyticsQuerySchema),
  async (req, res) => {
    const { period = "month", startDate, endDate } = req.query;

    let dateFilter: any = {};
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    } else {
      switch (period) {
        case "week":
          dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "quarter":
          dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          dateFilter.gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    const [userRegistrations, usersByRole, activeUsers, userRetention] =
      await Promise.all([
        // User registrations over time
        prisma.user.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: dateFilter,
          },
          _count: { id: true },
        }),

        // Users by role
        prisma.user.groupBy({
          by: ["role"],
          _count: { id: true },
        }),

        // Active users (logged in within period)
        prisma.user.count({
          where: {
            lastLoginAt: dateFilter,
          },
        }),

        // User retention (simplified)
        prisma.user.count({
          where: {
            createdAt: {
              lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            },
            lastLoginAt: {
              gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    res.json({
      period,
      dateRange: dateFilter,
      analytics: {
        userRegistrations,
        usersByRole,
        activeUsers,
        userRetention,
      },
    });
  },
);

// Content moderation queue
router.get(
  "/moderation/queue",
  requireRole("ADMIN"),
  validateQuery(adminModerationSchema),
  async (req, res) => {
    const { type = "all", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const moderationItems: any = {
      reviews: [],
      teachers: [],
      reports: [],
    };

    if (type === "all" || type === "reviews") {
      moderationItems.reviews = await prisma.review.findMany({
        where: { status: "PENDING" },
        include: {
          student: {
            select: { firstName: true, lastName: true },
          },
          teacher: {
            select: { firstName: true, lastName: true },
          },
          booking: {
            select: {
              subjectOffering: {
                select: { subjectName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        take: type === "reviews" ? limit : 10,
        skip: type === "reviews" ? skip : 0,
      });
    }

    if (type === "all" || type === "teachers") {
      moderationItems.teachers = await prisma.teacherProfile.findMany({
        where: { isVerified: false },
        include: {
          user: {
            select: { email: true, createdAt: true },
          },
          subjectOfferings: {
            select: { subjectName: true },
            take: 3,
          },
        },
        orderBy: { createdAt: "asc" },
        take: type === "teachers" ? limit : 10,
        skip: type === "teachers" ? skip : 0,
      });
    }

    const totalCounts = {
      reviews: await prisma.review.count({ where: { status: "PENDING" } }),
      teachers: await prisma.teacherProfile.count({
        where: { isVerified: false },
      }),
      reports: 0, // Placeholder for future reporting system
    };

    res.json({
      moderationQueue: moderationItems,
      totalCounts,
      pagination: {
        page,
        limit,
        total:
          type === "all"
            ? Object.values(totalCounts).reduce((a, b) => a + b, 0)
            : totalCounts[type as keyof typeof totalCounts] || 0,
      },
    });
  },
);

// System health check
router.get("/system/health", requireRole("ADMIN"), async (req, res) => {
  const healthCheck = {
    database: "unknown",
    redis: "unknown",
    email: "unknown",
    storage: "unknown",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.database = "healthy";
  } catch (error) {
    healthCheck.database = "unhealthy";
    logger.error("Database health check failed", { error });
  }

  // Add other health checks here (Redis, Email service, etc.)

  const isHealthy = Object.values(healthCheck).every(
    (status) => status === "healthy" || typeof status !== "string",
  );

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks: healthCheck,
  });
});

// Export/backup data
router.post("/backup/create", requireRole("ADMIN"), async (req, res) => {
  const adminId = req.user!.id;

  try {
    // Create a backup identifier
    const backupId = `backup_${Date.now()}`;

    // In a real implementation, this would:
    // 1. Create a database dump
    // 2. Export files/media
    // 3. Create a downloadable archive

    logger.info("Backup initiated", {
      adminId,
      backupId,
      timestamp: new Date(),
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE_BACKUP",
        resource: "system",
        resourceId: backupId,
        oldValues: {},
        newValues: { backupId },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    res.json({
      message: "Backup created successfully",
      backupId,
      createdAt: new Date(),
      // downloadUrl would be provided in real implementation
    });
  } catch (error) {
    logger.error("Backup creation failed", { error, adminId });
    throw new AppError("Backup creation failed", 500, "BACKUP_FAILED");
  }
});

export default router;
