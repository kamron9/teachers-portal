import express from "express";
import { prisma } from "../lib/prisma";
import { requireRole } from "../middleware/auth";
import { validateQuery, validateRequest } from "../middleware/validation";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";
import {
  revenueReportSchema,
  userAnalyticsSchema,
  teacherPerformanceSchema,
  bookingAnalyticsSchema,
  platformMetricsSchema,
  customReportSchema,
} from "../validators/reportValidators";

const router = express.Router();

// Revenue and financial reports
router.get(
  "/revenue",
  requireRole("ADMIN"),
  validateQuery(revenueReportSchema),
  async (req, res) => {
    const {
      startDate,
      endDate,
      groupBy = "day",
      includeRefunds = true,
      currency = "UZS",
    } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      // Revenue overview
      const [
        totalRevenue,
        totalRefunds,
        platformFees,
        teacherEarnings,
        revenueByPeriod,
        topEarningTeachers,
        revenueBySubject,
        paymentMethods,
      ] = await Promise.all([
        // Total revenue
        prisma.payment.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: { amount: true },
          _count: { id: true },
        }),

        // Total refunds
        prisma.payment.aggregate({
          where: {
            status: "REFUNDED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: { amount: true },
          _count: { id: true },
        }),

        // Platform fees collected
        prisma.payment.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: { platformFee: true },
        }),

        // Teacher earnings
        prisma.payment.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: { teacherAmount: true },
        }),

        // Revenue grouped by time period
        prisma.payment.findMany({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          select: {
            amount: true,
            platformFee: true,
            teacherAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        }),

        // Top earning teachers
        prisma.payment.groupBy({
          by: ["teacherId"],
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: {
            teacherAmount: true,
            amount: true,
          },
          _count: { id: true },
          orderBy: {
            _sum: {
              teacherAmount: "desc",
            },
          },
          take: 10,
        }),

        // Revenue by subject
        prisma.payment.findMany({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          include: {
            booking: {
              include: {
                subjectOffering: {
                  select: { subjectName: true },
                },
              },
            },
          },
        }),

        // Payment methods
        prisma.payment.groupBy({
          by: ["paymentMethod"],
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
            currency,
          },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

      // Process revenue by subject
      const subjectRevenue = revenueBySubject.reduce((acc: any, payment) => {
        const subject = payment.booking?.subjectOffering?.subjectName || "Unknown";
        if (!acc[subject]) {
          acc[subject] = { revenue: 0, count: 0 };
        }
        acc[subject].revenue += payment.amount;
        acc[subject].count += 1;
        return acc;
      }, {});

      // Group revenue by time period
      const groupedRevenue = groupRevenueByPeriod(revenueByPeriod, groupBy as string);

      // Get teacher details for top earners
      const teacherIds = topEarningTeachers.map(t => t.teacherId);
      const teacherDetails = await prisma.teacherProfile.findMany({
        where: { id: { in: teacherIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      });

      const topEarnersWithDetails = topEarningTeachers.map(earnings => {
        const teacher = teacherDetails.find(t => t.id === earnings.teacherId);
        return {
          ...earnings,
          teacher,
        };
      });

      const report = {
        period: { start: startDate, end: endDate },
        currency,
        overview: {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalTransactions: totalRevenue._count || 0,
          totalRefunds: includeRefunds ? (totalRefunds._sum.amount || 0) : 0,
          refundCount: includeRefunds ? (totalRefunds._count || 0) : 0,
          netRevenue: (totalRevenue._sum.amount || 0) - (includeRefunds ? (totalRefunds._sum.amount || 0) : 0),
          platformFees: platformFees._sum.platformFee || 0,
          teacherEarnings: teacherEarnings._sum.teacherAmount || 0,
        },
        trends: {
          revenueByPeriod: groupedRevenue,
          groupBy,
        },
        breakdown: {
          bySubject: Object.entries(subjectRevenue).map(([subject, data]: [string, any]) => ({
            subject,
            revenue: data.revenue,
            transactions: data.count,
          })),
          byPaymentMethod: paymentMethods,
          topEarningTeachers: topEarnersWithDetails,
        },
      };

      logger.info("Revenue report generated", {
        adminId: req.user!.id,
        period: { start: startDate, end: endDate },
        totalRevenue: report.overview.totalRevenue,
      });

      res.json(report);
    } catch (error) {
      logger.error("Error generating revenue report", { error });
      throw new AppError("Failed to generate revenue report", 500, "REPORT_GENERATION_ERROR");
    }
  }
);

// User analytics and growth reports
router.get(
  "/users",
  requireRole("ADMIN"),
  validateQuery(userAnalyticsSchema),
  async (req, res) => {
    const {
      startDate,
      endDate,
      groupBy = "day",
      includeInactive = false,
      userType = "all",
    } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      let userFilter: any = {
        createdAt: { gte: start, lte: end },
      };

      if (!includeInactive) {
        userFilter.isActive = true;
      }

      if (userType !== "all") {
        userFilter.role = userType;
      }

      const [
        userRegistrations,
        activeUsers,
        userRetention,
        usersByRole,
        usersByRegion,
        loginActivity,
        userEngagement,
      ] = await Promise.all([
        // User registrations over time
        prisma.user.findMany({
          where: userFilter,
          select: {
            createdAt: true,
            role: true,
            isActive: true,
          },
          orderBy: { createdAt: "asc" },
        }),

        // Active users (logged in within last 30 days)
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            isActive: true,
          },
        }),

        // User retention (users who registered and are still active)
        prisma.user.count({
          where: {
            createdAt: { gte: start, lte: end },
            isActive: true,
            lastLoginAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Users by role
        prisma.user.groupBy({
          by: ["role"],
          where: {
            createdAt: { gte: start, lte: end },
            ...(includeInactive ? {} : { isActive: true }),
          },
          _count: { id: true },
        }),

        // Users by region (from teacher/student profiles)
        Promise.all([
          prisma.teacherProfile.groupBy({
            by: ["region"],
            where: {
              user: {
                createdAt: { gte: start, lte: end },
                ...(includeInactive ? {} : { isActive: true }),
              },
            },
            _count: { id: true },
          }),
          prisma.studentProfile.groupBy({
            by: ["region"],
            where: {
              user: {
                createdAt: { gte: start, lte: end },
                ...(includeInactive ? {} : { isActive: true }),
              },
            },
            _count: { id: true },
          }),
        ]),

        // Login activity
        prisma.user.findMany({
          where: {
            lastLoginAt: { gte: start, lte: end },
            ...(includeInactive ? {} : { isActive: true }),
          },
          select: {
            lastLoginAt: true,
            role: true,
          },
        }),

        // User engagement metrics
        Promise.all([
          prisma.booking.groupBy({
            by: ["studentId"],
            where: {
              createdAt: { gte: start, lte: end },
            },
            _count: { id: true },
          }),
          prisma.review.groupBy({
            by: ["studentId"],
            where: {
              createdAt: { gte: start, lte: end },
            },
            _count: { id: true },
          }),
        ]),
      ]);

      // Process data
      const groupedRegistrations = groupDataByPeriod(userRegistrations, groupBy as string, "createdAt");
      const groupedLogins = groupDataByPeriod(loginActivity, groupBy as string, "lastLoginAt");

      // Combine regional data
      const [teacherRegions, studentRegions] = usersByRegion;
      const combinedRegions = [...teacherRegions, ...studentRegions].reduce((acc: any, region) => {
        const regionName = region.region || "Unknown";
        if (!acc[regionName]) {
          acc[regionName] = 0;
        }
        acc[regionName] += region._count.id;
        return acc;
      }, {});

      const [bookingsByUser, reviewsByUser] = userEngagement;
      const avgBookingsPerUser = bookingsByUser.length > 0 
        ? bookingsByUser.reduce((sum, b) => sum + b._count.id, 0) / bookingsByUser.length 
        : 0;
      const avgReviewsPerUser = reviewsByUser.length > 0 
        ? reviewsByUser.reduce((sum, r) => sum + r._count.id, 0) / reviewsByUser.length 
        : 0;

      const report = {
        period: { start: startDate, end: endDate },
        overview: {
          totalRegistrations: userRegistrations.length,
          activeUsers,
          retentionRate: userRegistrations.length > 0 ? (userRetention / userRegistrations.length) * 100 : 0,
          avgBookingsPerUser: parseFloat(avgBookingsPerUser.toFixed(2)),
          avgReviewsPerUser: parseFloat(avgReviewsPerUser.toFixed(2)),
        },
        trends: {
          registrationsByPeriod: groupedRegistrations,
          loginsByPeriod: groupedLogins,
          groupBy,
        },
        breakdown: {
          byRole: usersByRole,
          byRegion: Object.entries(combinedRegions).map(([region, count]) => ({
            region,
            count,
          })),
        },
      };

      logger.info("User analytics report generated", {
        adminId: req.user!.id,
        period: { start: startDate, end: endDate },
        totalRegistrations: report.overview.totalRegistrations,
      });

      res.json(report);
    } catch (error) {
      logger.error("Error generating user analytics report", { error });
      throw new AppError("Failed to generate user analytics report", 500, "REPORT_GENERATION_ERROR");
    }
  }
);

// Teacher performance reports
router.get(
  "/teachers/performance",
  requireRole("ADMIN"),
  validateQuery(teacherPerformanceSchema),
  async (req, res) => {
    const {
      startDate,
      endDate,
      includeUnverified = false,
      minBookings = 0,
      sortBy = "rating",
    } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      let whereClause: any = {};

      if (!includeUnverified) {
        whereClause.isVerified = true;
      }

      const teachers = await prisma.teacherProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              lastLoginAt: true,
            },
          },
          bookings: {
            where: {
              createdAt: { gte: start, lte: end },
            },
            select: {
              id: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
          },
          reviews: {
            where: {
              status: "APPROVED",
              createdAt: { gte: start, lte: end },
            },
            select: {
              rating: true,
              createdAt: true,
            },
          },
          subjectOfferings: {
            select: {
              subjectName: true,
              pricePerHour: true,
            },
          },
          payments: {
            where: {
              status: "COMPLETED",
              createdAt: { gte: start, lte: end },
            },
            select: {
              teacherAmount: true,
              createdAt: true,
            },
          },
        },
      });

      // Process teacher performance data
      const performanceData = teachers
        .map(teacher => {
          const completedBookings = teacher.bookings.filter(b => b.status === "COMPLETED");
          const cancelledBookings = teacher.bookings.filter(b => b.status === "CANCELLED");
          const totalEarnings = teacher.payments.reduce((sum, p) => sum + p.teacherAmount, 0);
          const avgRating = teacher.reviews.length > 0 
            ? teacher.reviews.reduce((sum, r) => sum + r.rating, 0) / teacher.reviews.length 
            : 0;

          return {
            id: teacher.id,
            name: `${teacher.firstName} ${teacher.lastName}`,
            email: teacher.user.email,
            isVerified: teacher.isVerified,
            joinDate: teacher.user.createdAt,
            lastActive: teacher.user.lastLoginAt,
            subjects: teacher.subjectOfferings.map(s => s.subjectName),
            metrics: {
              totalBookings: teacher.bookings.length,
              completedBookings: completedBookings.length,
              cancelledBookings: cancelledBookings.length,
              completionRate: teacher.bookings.length > 0 
                ? (completedBookings.length / teacher.bookings.length) * 100 
                : 0,
              totalEarnings,
              avgRating: parseFloat(avgRating.toFixed(2)),
              totalReviews: teacher.reviews.length,
              hourlyRate: teacher.hourlyRate || 0,
            },
          };
        })
        .filter(teacher => teacher.metrics.totalBookings >= minBookings);

      // Sort teachers
      performanceData.sort((a, b) => {
        switch (sortBy) {
          case "earnings":
            return b.metrics.totalEarnings - a.metrics.totalEarnings;
          case "bookings":
            return b.metrics.totalBookings - a.metrics.totalBookings;
          case "completionRate":
            return b.metrics.completionRate - a.metrics.completionRate;
          case "rating":
          default:
            return b.metrics.avgRating - a.metrics.avgRating;
        }
      });

      // Calculate aggregates
      const totalTeachers = performanceData.length;
      const avgCompletionRate = totalTeachers > 0 
        ? performanceData.reduce((sum, t) => sum + t.metrics.completionRate, 0) / totalTeachers 
        : 0;
      const avgRating = totalTeachers > 0 
        ? performanceData.reduce((sum, t) => sum + t.metrics.avgRating, 0) / totalTeachers 
        : 0;
      const totalEarnings = performanceData.reduce((sum, t) => sum + t.metrics.totalEarnings, 0);

      const report = {
        period: { start: startDate, end: endDate },
        overview: {
          totalTeachers,
          avgCompletionRate: parseFloat(avgCompletionRate.toFixed(2)),
          avgRating: parseFloat(avgRating.toFixed(2)),
          totalEarnings,
        },
        teachers: performanceData.slice(0, 100), // Limit to top 100
        filters: {
          includeUnverified,
          minBookings,
          sortBy,
        },
      };

      logger.info("Teacher performance report generated", {
        adminId: req.user!.id,
        period: { start: startDate, end: endDate },
        teacherCount: totalTeachers,
      });

      res.json(report);
    } catch (error) {
      logger.error("Error generating teacher performance report", { error });
      throw new AppError("Failed to generate teacher performance report", 500, "REPORT_GENERATION_ERROR");
    }
  }
);

// Booking analytics
router.get(
  "/bookings",
  requireRole("ADMIN"),
  validateQuery(bookingAnalyticsSchema),
  async (req, res) => {
    const {
      startDate,
      endDate,
      groupBy = "day",
      includeStatus,
      subjectFilter,
    } = req.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    try {
      let whereClause: any = {
        createdAt: { gte: start, lte: end },
      };

      if (includeStatus && Array.isArray(includeStatus)) {
        whereClause.status = { in: includeStatus };
      }

      if (subjectFilter) {
        whereClause.subjectOffering = {
          subjectName: {
            contains: subjectFilter as string,
            mode: "insensitive",
          },
        };
      }

      const [
        bookings,
        bookingsByStatus,
        bookingsBySubject,
        avgBookingValue,
        peakHours,
        cancellationReasons,
      ] = await Promise.all([
        // All bookings in period
        prisma.booking.findMany({
          where: whereClause,
          include: {
            subjectOffering: {
              select: { subjectName: true },
            },
          },
          orderBy: { createdAt: "asc" },
        }),

        // Bookings by status
        prisma.booking.groupBy({
          by: ["status"],
          where: whereClause,
          _count: { id: true },
        }),

        // Bookings by subject
        prisma.booking.findMany({
          where: whereClause,
          include: {
            subjectOffering: {
              select: { subjectName: true },
            },
          },
        }),

        // Average booking value
        prisma.booking.aggregate({
          where: {
            ...whereClause,
            status: "COMPLETED",
          },
          _avg: { totalAmount: true },
        }),

        // Peak booking hours
        prisma.booking.findMany({
          where: whereClause,
          select: { startAt: true },
        }),

        // Cancellation reasons
        prisma.booking.groupBy({
          by: ["cancellationReason"],
          where: {
            ...whereClause,
            status: "CANCELLED",
          },
          _count: { id: true },
        }),
      ]);

      // Process data
      const groupedBookings = groupDataByPeriod(bookings, groupBy as string, "createdAt");

      const subjectBookings = bookingsBySubject.reduce((acc: any, booking) => {
        const subject = booking.subjectOffering?.subjectName || "Unknown";
        if (!acc[subject]) {
          acc[subject] = { count: 0, revenue: 0 };
        }
        acc[subject].count += 1;
        if (booking.status === "COMPLETED") {
          acc[subject].revenue += booking.totalAmount;
        }
        return acc;
      }, {});

      const hourCounts = peakHours.reduce((acc: any, booking) => {
        const hour = new Date(booking.startAt).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const report = {
        period: { start: startDate, end: endDate },
        overview: {
          totalBookings: bookings.length,
          avgBookingValue: avgBookingValue._avg.totalAmount || 0,
          completionRate: bookings.length > 0 
            ? (bookings.filter(b => b.status === "COMPLETED").length / bookings.length) * 100 
            : 0,
          cancellationRate: bookings.length > 0 
            ? (bookings.filter(b => b.status === "CANCELLED").length / bookings.length) * 100 
            : 0,
        },
        trends: {
          bookingsByPeriod: groupedBookings,
          groupBy,
        },
        breakdown: {
          byStatus: bookingsByStatus,
          bySubject: Object.entries(subjectBookings).map(([subject, data]: [string, any]) => ({
            subject,
            count: data.count,
            revenue: data.revenue,
          })),
          peakHours: Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count),
          cancellationReasons: cancellationReasons.filter(r => r.cancellationReason),
        },
        filters: {
          includeStatus,
          subjectFilter,
        },
      };

      logger.info("Booking analytics report generated", {
        adminId: req.user!.id,
        period: { start: startDate, end: endDate },
        totalBookings: bookings.length,
      });

      res.json(report);
    } catch (error) {
      logger.error("Error generating booking analytics report", { error });
      throw new AppError("Failed to generate booking analytics report", 500, "REPORT_GENERATION_ERROR");
    }
  }
);

// Platform metrics dashboard
router.get(
  "/platform/metrics",
  requireRole("ADMIN"),
  validateQuery(platformMetricsSchema),
  async (req, res) => {
    const { period = "week" } = req.query;

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
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    try {
      const [
        userMetrics,
        bookingMetrics,
        revenueMetrics,
        contentMetrics,
        systemMetrics,
      ] = await Promise.all([
        // User metrics
        Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { role: "TEACHER" } }),
          prisma.user.count({ where: { role: "STUDENT" } }),
          prisma.user.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
          prisma.user.count({
            where: {
              lastLoginAt: { gte: startDate },
            },
          }),
        ]),

        // Booking metrics
        Promise.all([
          prisma.booking.count(),
          prisma.booking.count({ where: { status: "COMPLETED" } }),
          prisma.booking.count({ where: { status: "CANCELLED" } }),
          prisma.booking.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
        ]),

        // Revenue metrics
        Promise.all([
          prisma.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { amount: true },
          }),
          prisma.payment.aggregate({
            where: {
              status: "COMPLETED",
              createdAt: { gte: startDate },
            },
            _sum: { amount: true },
          }),
          prisma.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { platformFee: true },
          }),
        ]),

        // Content metrics
        Promise.all([
          prisma.review.count({ where: { status: "APPROVED" } }),
          prisma.review.count({ where: { status: "PENDING" } }),
          prisma.subject.count(),
          prisma.teacherProfile.count({ where: { isVerified: true } }),
        ]),

        // System metrics
        Promise.all([
          prisma.auditLog.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
          prisma.notification.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
        ]),
      ]);

      const [
        totalUsers,
        totalTeachers,
        totalStudents,
        newUsers,
        activeUsers,
      ] = userMetrics;

      const [
        totalBookings,
        completedBookings,
        cancelledBookings,
        newBookings,
      ] = bookingMetrics;

      const [
        totalRevenue,
        periodRevenue,
        totalFees,
      ] = revenueMetrics;

      const [
        approvedReviews,
        pendingReviews,
        totalSubjects,
        verifiedTeachers,
      ] = contentMetrics;

      const [
        auditLogs,
        notifications,
      ] = systemMetrics;

      const metrics = {
        period: period as string,
        dateRange: { start: startDate, end: now },
        users: {
          total: totalUsers,
          teachers: totalTeachers,
          students: totalStudents,
          newInPeriod: newUsers,
          activeInPeriod: activeUsers,
          growthRate: totalUsers > newUsers 
            ? ((newUsers / (totalUsers - newUsers)) * 100).toFixed(2) 
            : "0",
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          newInPeriod: newBookings,
          completionRate: totalBookings > 0 
            ? ((completedBookings / totalBookings) * 100).toFixed(2) 
            : "0",
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          periodRevenue: periodRevenue._sum.amount || 0,
          platformFees: totalFees._sum.platformFee || 0,
          avgPerBooking: completedBookings > 0 
            ? ((totalRevenue._sum.amount || 0) / completedBookings).toFixed(2) 
            : "0",
        },
        content: {
          approvedReviews,
          pendingReviews,
          totalSubjects,
          verifiedTeachers,
          verificationRate: totalTeachers > 0 
            ? ((verifiedTeachers / totalTeachers) * 100).toFixed(2) 
            : "0",
        },
        system: {
          auditLogsInPeriod: auditLogs,
          notificationsInPeriod: notifications,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
      };

      logger.info("Platform metrics report generated", {
        adminId: req.user!.id,
        period,
        totalUsers,
        totalRevenue: totalRevenue._sum.amount || 0,
      });

      res.json(metrics);
    } catch (error) {
      logger.error("Error generating platform metrics", { error });
      throw new AppError("Failed to generate platform metrics", 500, "METRICS_GENERATION_ERROR");
    }
  }
);

// Custom report builder
router.post(
  "/custom",
  requireRole("ADMIN"),
  validateRequest(customReportSchema),
  async (req, res) => {
    const {
      reportName,
      dataSource,
      metrics,
      filters,
      groupBy,
      startDate,
      endDate,
      limit = 1000,
    } = req.body;

    const adminId = req.user!.id;

    try {
      let result: any = {};

      // Build base query based on data source
      switch (dataSource) {
        case "users":
          result = await buildUserReport(metrics, filters, groupBy, startDate, endDate, limit);
          break;
        case "bookings":
          result = await buildBookingReport(metrics, filters, groupBy, startDate, endDate, limit);
          break;
        case "payments":
          result = await buildPaymentReport(metrics, filters, groupBy, startDate, endDate, limit);
          break;
        case "reviews":
          result = await buildReviewReport(metrics, filters, groupBy, startDate, endDate, limit);
          break;
        default:
          throw new AppError("Invalid data source", 400, "INVALID_DATA_SOURCE");
      }

      // Store report configuration for future use
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "GENERATE_CUSTOM_REPORT",
          resource: "report",
          resourceId: `custom_${Date.now()}`,
          oldValues: {},
          newValues: {
            reportName,
            dataSource,
            metrics,
            filters,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      });

      logger.info("Custom report generated", {
        adminId,
        reportName,
        dataSource,
        recordCount: Array.isArray(result.data) ? result.data.length : 1,
      });

      res.json({
        reportName,
        generatedAt: new Date(),
        parameters: {
          dataSource,
          metrics,
          filters,
          groupBy,
          period: { start: startDate, end: endDate },
          limit,
        },
        result,
      });
    } catch (error) {
      logger.error("Error generating custom report", { error, reportName });
      throw new AppError("Failed to generate custom report", 500, "CUSTOM_REPORT_ERROR");
    }
  }
);

// Helper functions
function groupRevenueByPeriod(payments: any[], groupBy: string) {
  // Implementation for grouping revenue data by time period
  const grouped: any = {};
  
  payments.forEach(payment => {
    let key: string;
    const date = new Date(payment.createdAt);
    
    switch (groupBy) {
      case "hour":
        key = date.toISOString().substring(0, 13);
        break;
      case "day":
        key = date.toISOString().substring(0, 10);
        break;
      case "week":
        const week = getWeekNumber(date);
        key = `${date.getFullYear()}-W${week}`;
        break;
      case "month":
        key = date.toISOString().substring(0, 7);
        break;
      default:
        key = date.toISOString().substring(0, 10);
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        revenue: 0,
        platformFees: 0,
        teacherAmount: 0,
        count: 0,
      };
    }
    
    grouped[key].revenue += payment.amount;
    grouped[key].platformFees += payment.platformFee || 0;
    grouped[key].teacherAmount += payment.teacherAmount || 0;
    grouped[key].count += 1;
  });
  
  return Object.values(grouped);
}

function groupDataByPeriod(data: any[], groupBy: string, dateField: string) {
  // Generic function for grouping data by time period
  const grouped: any = {};
  
  data.forEach(item => {
    let key: string;
    const date = new Date(item[dateField]);
    
    switch (groupBy) {
      case "hour":
        key = date.toISOString().substring(0, 13);
        break;
      case "day":
        key = date.toISOString().substring(0, 10);
        break;
      case "week":
        const week = getWeekNumber(date);
        key = `${date.getFullYear()}-W${week}`;
        break;
      case "month":
        key = date.toISOString().substring(0, 7);
        break;
      default:
        key = date.toISOString().substring(0, 10);
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        count: 0,
        data: [],
      };
    }
    
    grouped[key].count += 1;
    grouped[key].data.push(item);
  });
  
  return Object.values(grouped);
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Custom report builders
async function buildUserReport(metrics: string[], filters: any, groupBy: string, startDate: string, endDate: string, limit: number) {
  // Implementation for custom user reports
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let whereClause: any = {
    createdAt: { gte: start, lte: end },
  };
  
  if (filters.role) whereClause.role = filters.role;
  if (filters.isActive !== undefined) whereClause.isActive = filters.isActive;
  
  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      teacherProfile: true,
      studentProfile: true,
      _count: {
        select: {
          teacherBookings: true,
          studentBookings: true,
        },
      },
    },
    take: limit,
  });
  
  return {
    data: users,
    summary: {
      totalCount: users.length,
      metrics: calculateUserMetrics(users, metrics),
    },
  };
}

async function buildBookingReport(metrics: string[], filters: any, groupBy: string, startDate: string, endDate: string, limit: number) {
  // Implementation for custom booking reports
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let whereClause: any = {
    createdAt: { gte: start, lte: end },
  };
  
  if (filters.status) whereClause.status = filters.status;
  if (filters.teacherId) whereClause.teacherId = filters.teacherId;
  
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      teacher: true,
      student: true,
      subjectOffering: true,
    },
    take: limit,
  });
  
  return {
    data: bookings,
    summary: {
      totalCount: bookings.length,
      metrics: calculateBookingMetrics(bookings, metrics),
    },
  };
}

async function buildPaymentReport(metrics: string[], filters: any, groupBy: string, startDate: string, endDate: string, limit: number) {
  // Implementation for custom payment reports
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let whereClause: any = {
    createdAt: { gte: start, lte: end },
  };
  
  if (filters.status) whereClause.status = filters.status;
  if (filters.paymentMethod) whereClause.paymentMethod = filters.paymentMethod;
  
  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      booking: {
        include: {
          teacher: true,
          student: true,
        },
      },
    },
    take: limit,
  });
  
  return {
    data: payments,
    summary: {
      totalCount: payments.length,
      metrics: calculatePaymentMetrics(payments, metrics),
    },
  };
}

async function buildReviewReport(metrics: string[], filters: any, groupBy: string, startDate: string, endDate: string, limit: number) {
  // Implementation for custom review reports
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let whereClause: any = {
    createdAt: { gte: start, lte: end },
  };
  
  if (filters.status) whereClause.status = filters.status;
  if (filters.rating) whereClause.rating = filters.rating;
  
  const reviews = await prisma.review.findMany({
    where: whereClause,
    include: {
      teacher: true,
      student: true,
      booking: true,
    },
    take: limit,
  });
  
  return {
    data: reviews,
    summary: {
      totalCount: reviews.length,
      metrics: calculateReviewMetrics(reviews, metrics),
    },
  };
}

function calculateUserMetrics(users: any[], metrics: string[]) {
  const result: any = {};
  
  if (metrics.includes("count")) {
    result.count = users.length;
  }
  
  if (metrics.includes("activeRate")) {
    result.activeRate = users.length > 0 
      ? (users.filter(u => u.isActive).length / users.length) * 100 
      : 0;
  }
  
  return result;
}

function calculateBookingMetrics(bookings: any[], metrics: string[]) {
  const result: any = {};
  
  if (metrics.includes("count")) {
    result.count = bookings.length;
  }
  
  if (metrics.includes("completionRate")) {
    const completed = bookings.filter(b => b.status === "COMPLETED").length;
    result.completionRate = bookings.length > 0 ? (completed / bookings.length) * 100 : 0;
  }
  
  if (metrics.includes("avgValue")) {
    const totalValue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    result.avgValue = bookings.length > 0 ? totalValue / bookings.length : 0;
  }
  
  return result;
}

function calculatePaymentMetrics(payments: any[], metrics: string[]) {
  const result: any = {};
  
  if (metrics.includes("totalAmount")) {
    result.totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }
  
  if (metrics.includes("avgAmount")) {
    const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    result.avgAmount = payments.length > 0 ? total / payments.length : 0;
  }
  
  return result;
}

function calculateReviewMetrics(reviews: any[], metrics: string[]) {
  const result: any = {};
  
  if (metrics.includes("avgRating")) {
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    result.avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  }
  
  if (metrics.includes("count")) {
    result.count = reviews.length;
  }
  
  return result;
}

export default router;
