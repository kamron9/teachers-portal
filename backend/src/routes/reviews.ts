import express from 'express';
import { prisma } from '../lib/prisma';
import { requireRole } from '../middleware/auth';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation';
import { AppError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { 
  createReviewSchema, 
  updateReviewSchema,
  reviewQuerySchema,
  moderateReviewSchema 
} from '../validators/reviewValidators';
import { commonSchemas } from '../middleware/validation';
import { sendEmail } from '../services/emailService';
import Joi from 'joi';

const router = express.Router();

// Create review (Student only)
router.post(
  '/',
  requireRole('STUDENT'),
  validateRequest(createReviewSchema),
  async (req, res) => {
    const studentId = req.user!.id;
    const { teacherId, bookingId, rating, comment, isAnonymous = false } = req.body;

    // Verify booking exists and belongs to student
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        studentId,
        teacherId,
        status: 'COMPLETED'
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                email: true
              }
            }
          }
        },
        subjectOffering: {
          select: {
            subjectName: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundError('Completed booking not found');
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        studentId,
        bookingId
      }
    });

    if (existingReview) {
      throw new AppError('Review already exists for this booking', 409, 'REVIEW_ALREADY_EXISTS');
    }

    // Check if booking is recent enough to review (e.g., within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (booking.endAt < thirtyDaysAgo) {
      throw new AppError('Cannot review lessons older than 30 days', 400, 'REVIEW_WINDOW_EXPIRED');
    }

    // Create review
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          studentId,
          teacherId,
          bookingId,
          rating,
          comment: comment?.trim(),
          isAnonymous,
          status: 'PENDING' // All reviews go through moderation
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          booking: {
            select: {
              startAt: true,
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          }
        }
      });

      // Update teacher's review statistics
      const teacherStats = await tx.review.aggregate({
        where: {
          teacherId,
          status: 'APPROVED'
        },
        _avg: { rating: true },
        _count: { id: true }
      });

      // Update teacher profile with new rating
      await tx.teacherProfile.update({
        where: { id: teacherId },
        data: {
          rating: teacherStats._avg.rating || rating,
          totalReviews: teacherStats._count.id
        }
      });

      return newReview;
    });

    // Send notification to teacher
    if (booking.teacher.user.email) {
      await sendEmail({
        to: booking.teacher.user.email,
        subject: 'New Review Received',
        template: 'review-received',
        data: {
          teacherName: `${booking.teacher.firstName} ${booking.teacher.lastName}`,
          rating,
          subject: booking.subjectOffering.subjectName,
          reviewerName: isAnonymous ? 'Anonymous' : `${review.student.firstName} ${review.student.lastName}`
        }
      });
    }

    logger.info('Review created', {
      reviewId: review.id,
      studentId,
      teacherId,
      bookingId,
      rating,
      isAnonymous
    });

    res.status(201).json({
      review,
      message: 'Review submitted successfully and is pending moderation'
    });
  }
);

// Get reviews for a teacher
router.get(
  '/teacher/:teacherId',
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  validateQuery(reviewQuerySchema),
  async (req, res) => {
    const { teacherId } = req.params;
    const { 
      rating,
      subject,
      status = 'APPROVED',
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeAnonymous = true
    } = req.query;

    // Verify teacher exists
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rating: true,
        totalReviews: true
      }
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    // Build where clause
    let whereClause: any = {
      teacherId,
      status
    };

    if (rating) {
      if (Array.isArray(rating)) {
        whereClause.rating = { in: rating.map(Number) };
      } else {
        whereClause.rating = Number(rating);
      }
    }

    if (subject) {
      whereClause.booking = {
        subjectOffering: {
          subjectName: {
            contains: subject as string,
            mode: 'insensitive'
          }
        }
      };
    }

    if (!includeAnonymous) {
      whereClause.isAnonymous = false;
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount, ratingDistribution] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          booking: {
            select: {
              id: true,
              startAt: true,
              subjectOffering: {
                select: {
                  subjectName: true,
                  level: true
                }
              }
            }
          }
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: limit
      }),

      prisma.review.count({ where: whereClause }),

      // Get rating distribution
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          teacherId,
          status: 'APPROVED'
        },
        _count: { rating: true },
        orderBy: { rating: 'desc' }
      })
    ]);

    res.json({
      teacher,
      reviews: reviews.map(review => ({
        ...review,
        student: review.isAnonymous ? null : review.student
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      statistics: {
        averageRating: teacher.rating,
        totalReviews: teacher.totalReviews,
        ratingDistribution
      }
    });
  }
);

// Get review by ID
router.get(
  '/:reviewId',
  validateParams(Joi.object({ reviewId: commonSchemas.id })),
  async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        booking: {
          select: {
            id: true,
            startAt: true,
            endAt: true,
            subjectOffering: {
              select: {
                subjectName: true,
                level: true
              }
            }
          }
        }
      }
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check access permissions
    if (userRole === 'STUDENT' && review.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && review.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Hide student info if anonymous (except for admin and the student themselves)
    if (review.isAnonymous && userRole !== 'ADMIN' && review.studentId !== userId) {
      review.student = null;
    }

    res.json(review);
  }
);

// Update review (Student only, within time limit)
router.put(
  '/:reviewId',
  requireRole('STUDENT'),
  validateParams(Joi.object({ reviewId: commonSchemas.id })),
  validateRequest(updateReviewSchema),
  async (req, res) => {
    const { reviewId } = req.params;
    const studentId = req.user!.id;
    const updateData = req.body;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        studentId
      }
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if review can still be updated (e.g., within 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    if (review.createdAt < twentyFourHoursAgo) {
      throw new AppError('Cannot update review older than 24 hours', 400, 'REVIEW_UPDATE_WINDOW_EXPIRED');
    }

    if (review.status !== 'PENDING') {
      throw new AppError('Cannot update review that has been moderated', 400, 'REVIEW_ALREADY_MODERATED');
    }

    const updatedReview = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: {
          ...updateData,
          ...(updateData.comment && { comment: updateData.comment.trim() }),
          status: 'PENDING' // Reset to pending if updated
        }
      });

      // If rating changed, recalculate teacher stats
      if (updateData.rating && updateData.rating !== review.rating) {
        const teacherStats = await tx.review.aggregate({
          where: {
            teacherId: review.teacherId,
            status: 'APPROVED'
          },
          _avg: { rating: true },
          _count: { id: true }
        });

        await tx.teacherProfile.update({
          where: { id: review.teacherId },
          data: {
            rating: teacherStats._avg.rating || updateData.rating,
            totalReviews: teacherStats._count.id
          }
        });
      }

      return updated;
    });

    logger.info('Review updated', {
      reviewId,
      studentId,
      changes: Object.keys(updateData)
    });

    res.json({
      review: updatedReview,
      message: 'Review updated successfully'
    });
  }
);

// Delete review (Student only, within time limit)
router.delete(
  '/:reviewId',
  requireRole('STUDENT'),
  validateParams(Joi.object({ reviewId: commonSchemas.id })),
  async (req, res) => {
    const { reviewId } = req.params;
    const studentId = req.user!.id;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        studentId
      }
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if review can still be deleted (e.g., within 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    if (review.createdAt < twentyFourHoursAgo) {
      throw new AppError('Cannot delete review older than 24 hours', 400, 'REVIEW_DELETE_WINDOW_EXPIRED');
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id: reviewId }
      });

      // Recalculate teacher stats
      const teacherStats = await tx.review.aggregate({
        where: {
          teacherId: review.teacherId,
          status: 'APPROVED'
        },
        _avg: { rating: true },
        _count: { id: true }
      });

      await tx.teacherProfile.update({
        where: { id: review.teacherId },
        data: {
          rating: teacherStats._avg.rating || 0,
          totalReviews: teacherStats._count.id
        }
      });
    });

    logger.info('Review deleted', {
      reviewId,
      studentId,
      teacherId: review.teacherId
    });

    res.json({
      message: 'Review deleted successfully'
    });
  }
);

// Moderate review (Admin only)
router.patch(
  '/:reviewId/moderate',
  requireRole('ADMIN'),
  validateParams(Joi.object({ reviewId: commonSchemas.id })),
  validateRequest(moderateReviewSchema),
  async (req, res) => {
    const { reviewId } = req.params;
    const { status, moderationReason } = req.body;
    const adminId = req.user!.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    const updatedReview = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: {
          status,
          moderationReason
        }
      });

      // Recalculate teacher stats if review was approved/rejected
      const teacherStats = await tx.review.aggregate({
        where: {
          teacherId: review.teacherId,
          status: 'APPROVED'
        },
        _avg: { rating: true },
        _count: { id: true }
      });

      await tx.teacherProfile.update({
        where: { id: review.teacherId },
        data: {
          rating: teacherStats._avg.rating || 0,
          totalReviews: teacherStats._count.id
        }
      });

      return updated;
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'MODERATE_REVIEW',
        resource: 'review',
        resourceId: reviewId,
        oldValues: { status: review.status },
        newValues: { status, moderationReason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.info('Review moderated', {
      reviewId,
      adminId,
      newStatus: status,
      moderationReason
    });

    res.json({
      review: updatedReview,
      message: `Review ${status.toLowerCase()} successfully`
    });
  }
);

// Get reviews pending moderation (Admin only)
router.get(
  '/moderation/pending',
  requireRole('ADMIN'),
  validateQuery(Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    teacherId: Joi.string().uuid().optional(),
    rating: Joi.number().integer().min(1).max(5).optional()
  })),
  async (req, res) => {
    const { page = 1, limit = 20, teacherId, rating } = req.query;

    let whereClause: any = {
      status: 'PENDING'
    };

    if (teacherId) {
      whereClause.teacherId = teacherId;
    }

    if (rating) {
      whereClause.rating = Number(rating);
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          booking: {
            select: {
              id: true,
              startAt: true,
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'asc' }, // Oldest first for moderation queue
        skip,
        take: limit
      }),

      prisma.review.count({ where: whereClause })
    ]);

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Get student's reviews
router.get(
  '/student/my-reviews',
  requireRole('STUDENT'),
  validateQuery(Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional()
  })),
  async (req, res) => {
    const studentId = req.user!.id;
    const { page = 1, limit = 20, status } = req.query;

    let whereClause: any = { studentId };
    if (status) {
      whereClause.status = status;
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          booking: {
            select: {
              id: true,
              startAt: true,
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),

      prisma.review.count({ where: whereClause })
    ]);

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Get review statistics
router.get(
  '/stats/overview',
  requireRole('ADMIN'),
  async (req, res) => {
    const [statusStats, ratingStats, recentTrends] = await Promise.all([
      // Reviews by status
      prisma.review.groupBy({
        by: ['status'],
        _count: { id: true }
      }),

      // Rating distribution
      prisma.review.groupBy({
        by: ['rating'],
        where: { status: 'APPROVED' },
        _count: { id: true },
        orderBy: { rating: 'desc' }
      }),

      // Recent trends (last 30 days)
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          status: 'APPROVED',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        _count: { id: true }
      })
    ]);

    const totalReviews = await prisma.review.count();
    const averageRating = await prisma.review.aggregate({
      where: { status: 'APPROVED' },
      _avg: { rating: true }
    });

    res.json({
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      statusDistribution: statusStats,
      ratingDistribution: ratingStats,
      recentTrends
    });
  }
);

export default router;
