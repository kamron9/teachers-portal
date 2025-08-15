import express from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import { AppError, NotFoundError } from "../utils/errors";
import { logger } from "../utils/logger";
import { sendEmail } from "../services/emailService";
import { sendSMS } from "../services/smsService";
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationQuerySchema,
  bulkNotificationSchema,
  notificationPreferencesSchema,
} from "../validators/notificationValidators";
import { commonSchemas } from "../middleware/validation";
import Joi from "joi";

const router = express.Router();

// Get user's notifications
router.get(
  "/",
  requireAuth,
  validateQuery(notificationQuerySchema),
  async (req, res) => {
    const userId = req.user!.id;
    const {
      type,
      isRead,
      priority,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    let whereClause: any = { userId };

    // Apply filters
    if (type) whereClause.type = type;
    if (isRead !== undefined) whereClause.isRead = isRead === "true";
    if (priority) whereClause.priority = priority;

    let orderBy: any;
    switch (sortBy) {
      case "priority":
        orderBy = { priority: sortOrder };
        break;
      case "type":
        orderBy = { type: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        include: {
          relatedBooking: {
            select: {
              id: true,
              status: true,
              startAt: true,
              teacher: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          relatedPayment: {
            select: {
              id: true,
              amount: true,
              status: true,
            },
          },
        },
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      unreadCount,
      appliedFilters: {
        type,
        isRead,
        priority,
      },
    });
  },
);

// Mark notification as read
router.patch(
  "/:notificationId/read",
  requireAuth,
  validateParams(Joi.object({ notificationId: commonSchemas.id })),
  async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user!.id;

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.isRead) {
      return res.json({
        notification,
        message: "Notification already marked as read",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    logger.info("Notification marked as read", {
      notificationId,
      userId,
    });

    res.json({
      notification: updatedNotification,
      message: "Notification marked as read",
    });
  },
);

// Mark all notifications as read
router.patch("/mark-all-read", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  logger.info("All notifications marked as read", {
    userId,
    count: result.count,
  });

  res.json({
    message: `${result.count} notifications marked as read`,
    count: result.count,
  });
});

// Delete notification
router.delete(
  "/:notificationId",
  requireAuth,
  validateParams(Joi.object({ notificationId: commonSchemas.id })),
  async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user!.id;

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    logger.info("Notification deleted", {
      notificationId,
      userId,
    });

    res.json({
      message: "Notification deleted successfully",
    });
  },
);

// Create notification (Admin/System use)
router.post(
  "/",
  requireRole("ADMIN"),
  validateRequest(createNotificationSchema),
  async (req, res) => {
    const {
      userId,
      userIds,
      type,
      title,
      message,
      priority = "MEDIUM",
      actionUrl,
      relatedBookingId,
      relatedPaymentId,
      scheduledFor,
      channels = ["IN_APP"],
    } = req.body;

    const adminId = req.user!.id;
    const targetUserIds = userIds || [userId];

    // Validate target users exist
    const users = await prisma.user.findMany({
      where: { id: { in: targetUserIds } },
      select: {
        id: true,
        email: true,
        role: true,
        notificationPreferences: true,
        teacherProfile: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        studentProfile: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (users.length !== targetUserIds.length) {
      throw new AppError("Some users not found", 404, "USERS_NOT_FOUND");
    }

    const notifications = [];
    const emailPromises = [];
    const smsPromises = [];

    for (const user of users) {
      // Create in-app notification
      if (channels.includes("IN_APP")) {
        const notification = await prisma.notification.create({
          data: {
            userId: user.id,
            type,
            title,
            message,
            priority,
            actionUrl,
            relatedBookingId,
            relatedPaymentId,
            scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            createdBy: adminId,
          },
        });
        notifications.push(notification);
      }

      // Send email notification
      if (channels.includes("EMAIL") && user.email) {
        const userPrefs = user.notificationPreferences as any;
        const emailEnabled = userPrefs?.email?.[type] !== false;

        if (emailEnabled) {
          emailPromises.push(
            sendEmail({
              to: user.email,
              subject: title,
              template: "notification",
              data: {
                userName: user.teacherProfile
                  ? `${user.teacherProfile.firstName} ${user.teacherProfile.lastName}`
                  : user.studentProfile
                    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`
                    : user.email,
                title,
                message,
                actionUrl,
                type,
              },
            }),
          );
        }
      }

      // Send SMS notification
      if (channels.includes("SMS")) {
        const phoneNumber =
          user.teacherProfile?.phoneNumber || user.studentProfile?.phoneNumber;

        if (phoneNumber) {
          const userPrefs = user.notificationPreferences as any;
          const smsEnabled = userPrefs?.sms?.[type] !== false;

          if (smsEnabled) {
            smsPromises.push(
              sendSMS({
                to: phoneNumber,
                message: `${title}: ${message}`,
              }),
            );
          }
        }
      }
    }

    // Send all external notifications
    try {
      await Promise.allSettled([...emailPromises, ...smsPromises]);
    } catch (error) {
      logger.error("Error sending external notifications", { error });
    }

    logger.info("Notifications created", {
      adminId,
      recipientCount: users.length,
      type,
      channels,
    });

    res.status(201).json({
      notifications,
      message: `${notifications.length} notifications created successfully`,
      recipients: users.length,
      channels,
    });
  },
);

// Bulk create notifications
router.post(
  "/bulk",
  requireRole("ADMIN"),
  validateRequest(bulkNotificationSchema),
  async (req, res) => {
    const { notifications, sendImmediately = true } = req.body;
    const adminId = req.user!.id;

    const createdNotifications = [];
    const errors = [];

    for (const notificationData of notifications) {
      try {
        const {
          userId,
          type,
          title,
          message,
          priority = "MEDIUM",
          actionUrl,
          relatedBookingId,
          relatedPaymentId,
          channels = ["IN_APP"],
        } = notificationData;

        // Verify user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            notificationPreferences: true,
            teacherProfile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
              },
            },
            studentProfile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
              },
            },
          },
        });

        if (!user) {
          errors.push({
            userId,
            error: "User not found",
          });
          continue;
        }

        // Create in-app notification
        if (channels.includes("IN_APP")) {
          const notification = await prisma.notification.create({
            data: {
              userId,
              type,
              title,
              message,
              priority,
              actionUrl,
              relatedBookingId,
              relatedPaymentId,
              createdBy: adminId,
            },
          });
          createdNotifications.push(notification);
        }

        // Send external notifications if immediate
        if (sendImmediately) {
          const userPrefs = user.notificationPreferences as any;

          // Email
          if (channels.includes("EMAIL") && user.email) {
            const emailEnabled = userPrefs?.email?.[type] !== false;
            if (emailEnabled) {
              await sendEmail({
                to: user.email,
                subject: title,
                template: "notification",
                data: {
                  userName: user.teacherProfile
                    ? `${user.teacherProfile.firstName} ${user.teacherProfile.lastName}`
                    : user.studentProfile
                      ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`
                      : user.email,
                  title,
                  message,
                  actionUrl,
                  type,
                },
              });
            }
          }

          // SMS
          if (channels.includes("SMS")) {
            const phoneNumber =
              user.teacherProfile?.phoneNumber ||
              user.studentProfile?.phoneNumber;

            if (phoneNumber) {
              const smsEnabled = userPrefs?.sms?.[type] !== false;
              if (smsEnabled) {
                await sendSMS({
                  to: phoneNumber,
                  message: `${title}: ${message}`,
                });
              }
            }
          }
        }
      } catch (error) {
        errors.push({
          userId: notificationData.userId,
          error: error.message,
        });
        logger.error("Error creating bulk notification", {
          error,
          notificationData,
        });
      }
    }

    logger.info("Bulk notifications created", {
      adminId,
      requested: notifications.length,
      created: createdNotifications.length,
      errors: errors.length,
    });

    res.status(201).json({
      message: `${createdNotifications.length} notifications created successfully`,
      created: createdNotifications.length,
      errors: errors.length,
      errorDetails: errors,
    });
  },
);

// Get notification preferences
router.get("/preferences", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      notificationPreferences: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const defaultPreferences = {
    email: {
      BOOKING_CONFIRMATION: true,
      BOOKING_REMINDER: true,
      BOOKING_CANCELLATION: true,
      PAYMENT_CONFIRMATION: true,
      PAYMENT_FAILED: true,
      REVIEW_REQUEST: true,
      REVIEW_RECEIVED: true,
      MESSAGE_RECEIVED: false,
      TEACHER_VERIFIED: true,
      PROMOTIONS: false,
      SYSTEM_UPDATES: true,
    },
    sms: {
      BOOKING_CONFIRMATION: true,
      BOOKING_REMINDER: true,
      BOOKING_CANCELLATION: true,
      PAYMENT_CONFIRMATION: true,
      PAYMENT_FAILED: true,
      REVIEW_REQUEST: false,
      REVIEW_RECEIVED: false,
      MESSAGE_RECEIVED: false,
      TEACHER_VERIFIED: false,
      PROMOTIONS: false,
      SYSTEM_UPDATES: false,
    },
    push: {
      BOOKING_CONFIRMATION: true,
      BOOKING_REMINDER: true,
      BOOKING_CANCELLATION: true,
      PAYMENT_CONFIRMATION: true,
      PAYMENT_FAILED: true,
      REVIEW_REQUEST: true,
      REVIEW_RECEIVED: true,
      MESSAGE_RECEIVED: true,
      TEACHER_VERIFIED: true,
      PROMOTIONS: false,
      SYSTEM_UPDATES: true,
    },
  };

  const preferences = user.notificationPreferences || defaultPreferences;

  res.json({
    preferences,
    lastUpdated: user.notificationPreferences ? undefined : null,
  });
});

// Update notification preferences
router.patch(
  "/preferences",
  requireAuth,
  validateRequest(notificationPreferencesSchema),
  async (req, res) => {
    const userId = req.user!.id;
    const { preferences } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: preferences,
      },
      select: {
        notificationPreferences: true,
      },
    });

    logger.info("Notification preferences updated", {
      userId,
      preferences,
    });

    res.json({
      preferences: updatedUser.notificationPreferences,
      message: "Notification preferences updated successfully",
    });
  },
);

// Get notification statistics (Admin only)
router.get(
  "/stats",
  requireRole("ADMIN"),
  validateQuery(
    Joi.object({
      period: Joi.string().valid("day", "week", "month").default("week"),
      type: Joi.string().optional(),
    }),
  ),
  async (req, res) => {
    const { period = "week", type } = req.query;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let whereClause: any = {
      createdAt: { gte: startDate },
    };

    if (type) {
      whereClause.type = type;
    }

    const [
      totalNotifications,
      notificationsByType,
      notificationsByPriority,
      readRate,
      activeUsers,
    ] = await Promise.all([
      // Total notifications
      prisma.notification.count({ where: whereClause }),

      // Notifications by type
      prisma.notification.groupBy({
        by: ["type"],
        where: whereClause,
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      // Notifications by priority
      prisma.notification.groupBy({
        by: ["priority"],
        where: whereClause,
        _count: { id: true },
      }),

      // Read rate
      prisma.notification.aggregate({
        where: whereClause,
        _count: {
          id: true,
          isRead: true,
        },
      }),

      // Active users with notifications
      prisma.notification.findMany({
        where: whereClause,
        select: { userId: true },
        distinct: ["userId"],
      }),
    ]);

    const readPercentage =
      totalNotifications > 0
        ? ((readRate._count.isRead || 0) / totalNotifications) * 100
        : 0;

    res.json({
      period,
      startDate,
      endDate: now,
      statistics: {
        totalNotifications,
        activeUsers: activeUsers.length,
        readRate: {
          total: readRate._count.id,
          read: readRate._count.isRead,
          percentage: readPercentage.toFixed(2),
        },
        byType: notificationsByType,
        byPriority: notificationsByPriority,
      },
    });
  },
);

// Send test notification (Admin only)
router.post(
  "/test",
  requireRole("ADMIN"),
  validateRequest(
    Joi.object({
      userId: commonSchemas.id.required(),
      channels: Joi.array()
        .items(Joi.string().valid("IN_APP", "EMAIL", "SMS"))
        .default(["IN_APP"]),
    }),
  ),
  async (req, res) => {
    const { userId, channels } = req.body;
    const adminId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        teacherProfile: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        studentProfile: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userName = user.teacherProfile
      ? `${user.teacherProfile.firstName} ${user.teacherProfile.lastName}`
      : user.studentProfile
        ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`
        : user.email;

    const testResults = {
      inApp: false,
      email: false,
      sms: false,
    };

    // Create in-app notification
    if (channels.includes("IN_APP")) {
      try {
        await prisma.notification.create({
          data: {
            userId,
            type: "SYSTEM_UPDATES",
            title: "Test Notification",
            message: "This is a test notification from the admin panel.",
            priority: "LOW",
            createdBy: adminId,
          },
        });
        testResults.inApp = true;
      } catch (error) {
        logger.error("Failed to create test in-app notification", { error });
      }
    }

    // Send test email
    if (channels.includes("EMAIL") && user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Test Notification",
          template: "notification",
          data: {
            userName,
            title: "Test Notification",
            message: "This is a test notification from the admin panel.",
            type: "SYSTEM_UPDATES",
          },
        });
        testResults.email = true;
      } catch (error) {
        logger.error("Failed to send test email", { error });
      }
    }

    // Send test SMS
    if (channels.includes("SMS")) {
      const phoneNumber =
        user.teacherProfile?.phoneNumber || user.studentProfile?.phoneNumber;

      if (phoneNumber) {
        try {
          await sendSMS({
            to: phoneNumber,
            message:
              "Test Notification: This is a test message from the tutoring platform.",
          });
          testResults.sms = true;
        } catch (error) {
          logger.error("Failed to send test SMS", { error });
        }
      }
    }

    logger.info("Test notifications sent", {
      adminId,
      targetUserId: userId,
      channels,
      results: testResults,
    });

    res.json({
      message: "Test notifications sent",
      results: testResults,
      userName,
    });
  },
);

export default router;
