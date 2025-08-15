import express from 'express';
import { prisma } from '../lib/prisma';
import { requireRole, requireVerification } from '../middleware/auth';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation';
import { AppError, NotFoundError, BookingError } from '../utils/errors';
import { logger } from '../utils/logger';
import { 
  createBookingSchema, 
  updateBookingSchema,
  bookingQuerySchema,
  rescheduleBookingSchema,
  cancelBookingSchema,
  attendanceSchema
} from '../validators/bookingValidators';
import { commonSchemas } from '../middleware/validation';
import { sendEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import { addHours, isBefore, parseISO, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import Joi from 'joi';

const router = express.Router();

// Get bookings (Student and Teacher)
router.get(
  '/',
  validateQuery(bookingQuerySchema),
  async (req, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { 
      status, 
      type, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      sortBy = 'startAt',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause based on user role
    const whereClause: any = {};
    
    if (userRole === 'STUDENT') {
      whereClause.studentId = userId;
    } else if (userRole === 'TEACHER') {
      whereClause.teacherId = userId;
    } else {
      throw new AppError('Invalid user role for booking access', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Add filters
    if (status) {
      whereClause.status = Array.isArray(status) ? { in: status } : status;
    }
    if (type) {
      whereClause.type = Array.isArray(type) ? { in: type } : type;
    }
    if (startDate || endDate) {
      whereClause.startAt = {};
      if (startDate) whereClause.startAt.gte = parseISO(startDate as string);
      if (endDate) whereClause.startAt.lte = parseISO(endDate as string);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
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
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              rating: true
            }
          },
          subjectOffering: {
            select: {
              id: true,
              subjectName: true,
              level: true,
              icon: true
            }
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              provider: true
            }
          },
          reviews: userRole === 'STUDENT' ? {
            where: { studentId: userId },
            select: {
              id: true,
              rating: true,
              comment: true,
              status: true
            }
          } : undefined
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: limit
      }),

      prisma.booking.count({ where: whereClause })
    ]);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Get booking by ID
router.get(
  '/:bookingId',
  validateParams(Joi.object({ bookingId: commonSchemas.id })),
  async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            timezone: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            timezone: true,
            cancellationPolicy: true
          }
        },
        subjectOffering: {
          select: {
            id: true,
            subjectName: true,
            level: true,
            pricePerHour: true,
            delivery: true,
            icon: true
          }
        },
        package: true,
        payment: true,
        reviews: true,
        disputes: true
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Check access permissions
    if (userRole === 'STUDENT' && booking.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && booking.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    res.json(booking);
  }
);

// Create booking (Student only)
router.post(
  '/',
  requireRole('STUDENT'),
  validateRequest(createBookingSchema),
  async (req, res) => {
    const studentId = req.user!.id;
    const { 
      teacherId, 
      subjectOfferingId, 
      startAt, 
      endAt, 
      type = 'SINGLE',
      studentTimezone = 'Asia/Tashkent',
      packageId 
    } = req.body;

    // Validate the booking request
    await validateBookingRequest({
      teacherId,
      subjectOfferingId,
      startAt: parseISO(startAt),
      endAt: parseISO(endAt),
      studentId,
      type,
      packageId
    });

    // Get subject offering for pricing
    const subjectOffering = await prisma.subjectOffering.findUnique({
      where: { id: subjectOfferingId },
      include: {
        teacher: {
          select: {
            minNoticeHours: true,
            maxAdvanceDays: true,
            timezone: true
          }
        }
      }
    });

    if (!subjectOffering) {
      throw new NotFoundError('Subject offering not found');
    }

    // Calculate lesson duration and price
    const durationMinutes = (parseISO(endAt).getTime() - parseISO(startAt).getTime()) / (1000 * 60);
    const durationHours = durationMinutes / 60;
    const priceAtBooking = Math.round(subjectOffering.pricePerHour * durationHours);

    // Create booking in transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          studentId,
          teacherId,
          subjectOfferingId,
          packageId,
          startAt: parseISO(startAt),
          endAt: parseISO(endAt),
          priceAtBooking,
          type,
          studentTimezone,
          teacherTimezone: subjectOffering.teacher.timezone,
          status: 'PENDING'
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              user: { select: { email: true, phone: true } }
            }
          },
          teacher: {
            select: {
              firstName: true,
              lastName: true,
              user: { select: { email: true, phone: true } }
            }
          },
          subjectOffering: {
            select: {
              subjectName: true
            }
          }
        }
      });

      // If it's a package booking, decrement remaining lessons
      if (packageId) {
        await tx.package.update({
          where: { id: packageId },
          data: { lessonsRemaining: { decrement: 1 } }
        });
      }

      return newBooking;
    });

    // Send notifications
    await sendBookingNotifications(booking, 'created');

    logger.info('Booking created', {
      bookingId: booking.id,
      studentId,
      teacherId,
      subjectOfferingId,
      priceAtBooking,
      type
    });

    res.status(201).json({
      booking,
      message: 'Booking created successfully'
    });
  }
);

// Update booking status (Teacher only)
router.patch(
  '/:bookingId/status',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateParams(Joi.object({ bookingId: commonSchemas.id })),
  validateRequest(Joi.object({
    status: Joi.string()
      .valid('CONFIRMED', 'CANCELLED')
      .required(),
    reason: Joi.string()
      .max(500)
      .optional()
  })),
  async (req, res) => {
    const { bookingId } = req.params;
    const { status, reason } = req.body;
    const teacherId = req.user!.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        teacherId,
        status: 'PENDING'
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { email: true, phone: true } }
          }
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true
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
      throw new NotFoundError('Booking not found or not in pending status');
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(status === 'CANCELLED' && {
          cancelledAt: new Date(),
          cancelledBy: teacherId,
          cancellationReason: reason
        })
      },
      include: {
        student: true,
        teacher: true,
        subjectOffering: true
      }
    });

    // Send notifications
    await sendBookingNotifications(updatedBooking, status === 'CONFIRMED' ? 'confirmed' : 'cancelled');

    logger.info('Booking status updated', {
      bookingId,
      teacherId,
      newStatus: status,
      reason
    });

    res.json({
      booking: updatedBooking,
      message: `Booking ${status.toLowerCase()} successfully`
    });
  }
);

// Reschedule booking
router.patch(
  '/:bookingId/reschedule',
  validateParams(Joi.object({ bookingId: commonSchemas.id })),
  validateRequest(rescheduleBookingSchema),
  async (req, res) => {
    const { bookingId } = req.params;
    const { newStartAt, newEndAt, reason } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        teacher: {
          select: {
            id: true,
            minNoticeHours: true,
            timezone: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Check permissions
    if (userRole === 'STUDENT' && booking.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && booking.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Check if booking can be rescheduled
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BookingError('Booking cannot be rescheduled', 'BOOKING_NOT_RESCHEDULABLE');
    }

    // Check minimum notice for rescheduling
    const now = new Date();
    const minNoticeTime = addHours(now, booking.teacher.minNoticeHours);
    const newStartTime = parseISO(newStartAt);

    if (isBefore(newStartTime, minNoticeTime)) {
      throw new BookingError(
        `Minimum ${booking.teacher.minNoticeHours} hours notice required for rescheduling`,
        'INSUFFICIENT_NOTICE'
      );
    }

    // Check for conflicts at new time
    await checkTimeSlotAvailability({
      teacherId: booking.teacherId,
      startAt: parseISO(newStartAt),
      endAt: parseISO(newEndAt),
      excludeBookingId: bookingId
    });

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startAt: parseISO(newStartAt),
        endAt: parseISO(newEndAt),
        status: 'PENDING' // Reset to pending for teacher approval
      },
      include: {
        student: true,
        teacher: true,
        subjectOffering: true
      }
    });

    // Send notifications
    await sendBookingNotifications(updatedBooking, 'rescheduled');

    logger.info('Booking rescheduled', {
      bookingId,
      userId,
      userRole,
      newStartAt,
      newEndAt,
      reason
    });

    res.json({
      booking: updatedBooking,
      message: 'Booking rescheduled successfully'
    });
  }
);

// Cancel booking
router.patch(
  '/:bookingId/cancel',
  validateParams(Joi.object({ bookingId: commonSchemas.id })),
  validateRequest(cancelBookingSchema),
  async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        teacher: {
          select: {
            id: true,
            minNoticeHours: true,
            cancellationPolicy: true
          }
        },
        payment: true,
        package: true
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Check permissions
    if (userRole === 'STUDENT' && booking.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && booking.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Check if booking can be cancelled
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BookingError('Booking cannot be cancelled', 'BOOKING_NOT_CANCELLABLE');
    }

    // Calculate cancellation penalty based on notice time
    const cancellationResult = calculateCancellationPolicy({
      booking,
      cancelledBy: userRole,
      minNoticeHours: booking.teacher.minNoticeHours
    });

    // Update booking in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: userId,
          cancellationReason: reason
        }
      });

      // Handle package lesson restoration if applicable
      if (booking.packageId && cancellationResult.restorePackageLesson) {
        await tx.package.update({
          where: { id: booking.packageId },
          data: { lessonsRemaining: { increment: 1 } }
        });
      }

      return { updatedBooking, cancellationResult };
    });

    // Send notifications
    await sendBookingNotifications(result.updatedBooking, 'cancelled');

    logger.info('Booking cancelled', {
      bookingId,
      userId,
      userRole,
      reason,
      penalty: cancellationResult.penalty,
      refundAmount: cancellationResult.refundAmount
    });

    res.json({
      booking: result.updatedBooking,
      cancellation: result.cancellationResult,
      message: 'Booking cancelled successfully'
    });
  }
);

// Mark attendance (Teacher only)
router.patch(
  '/:bookingId/attendance',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateParams(Joi.object({ bookingId: commonSchemas.id })),
  validateRequest(attendanceSchema),
  async (req, res) => {
    const { bookingId } = req.params;
    const { 
      studentAttended, 
      teacherAttended, 
      actualStartAt, 
      actualEndAt, 
      lessonNotes 
    } = req.body;
    const teacherId = req.user!.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        teacherId,
        status: 'CONFIRMED'
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found or not confirmed');
    }

    // Update booking with attendance info
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        studentAttended,
        teacherAttended,
        actualStartAt: actualStartAt ? parseISO(actualStartAt) : undefined,
        actualEndAt: actualEndAt ? parseISO(actualEndAt) : undefined,
        lessonNotes,
        status: 'COMPLETED'
      },
      include: {
        student: true,
        teacher: true,
        subjectOffering: true
      }
    });

    // Update teacher statistics
    await prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        totalLessons: { increment: 1 }
      }
    });

    logger.info('Booking attendance marked', {
      bookingId,
      teacherId,
      studentAttended,
      teacherAttended
    });

    res.json({
      booking: updatedBooking,
      message: 'Attendance marked successfully'
    });
  }
);

// Get booking statistics
router.get(
  '/stats/overview',
  async (req, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};
    if (userRole === 'STUDENT') {
      whereClause.studentId = userId;
    } else if (userRole === 'TEACHER') {
      whereClause.teacherId = userId;
    }

    const [statusStats, typeStats, monthlyStats] = await Promise.all([
      // Bookings by status
      prisma.booking.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true }
      }),

      // Bookings by type
      prisma.booking.groupBy({
        by: ['type'],
        where: whereClause,
        _count: { id: true }
      }),

      // Monthly booking trends (last 6 months)
      prisma.booking.groupBy({
        by: ['status'],
        where: {
          ...whereClause,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        _count: { id: true }
      })
    ]);

    res.json({
      statusDistribution: statusStats,
      typeDistribution: typeStats,
      monthlyTrends: monthlyStats
    });
  }
);

// Helper functions
async function validateBookingRequest(params: {
  teacherId: string;
  subjectOfferingId: string;
  startAt: Date;
  endAt: Date;
  studentId: string;
  type: string;
  packageId?: string;
}): Promise<void> {
  const { teacherId, subjectOfferingId, startAt, endAt, studentId, type, packageId } = params;

  // Check if teacher is verified
  const teacher = await prisma.teacherProfile.findUnique({
    where: { 
      id: teacherId,
      verificationStatus: 'APPROVED'
    },
    select: {
      minNoticeHours: true,
      maxAdvanceDays: true
    }
  });

  if (!teacher) {
    throw new BookingError('Teacher not found or not verified', 'TEACHER_NOT_VERIFIED');
  }

  // Check minimum notice and maximum advance booking
  const now = new Date();
  const minNoticeTime = addHours(now, teacher.minNoticeHours);
  const maxAdvanceTime = addHours(now, teacher.maxAdvanceDays * 24);

  if (isBefore(startAt, minNoticeTime)) {
    throw new BookingError(
      `Minimum ${teacher.minNoticeHours} hours notice required`,
      'INSUFFICIENT_NOTICE'
    );
  }

  if (isBefore(maxAdvanceTime, startAt)) {
    throw new BookingError(
      `Cannot book more than ${teacher.maxAdvanceDays} days in advance`,
      'BOOKING_TOO_FAR_AHEAD'
    );
  }

  // Check for time slot conflicts
  await checkTimeSlotAvailability({
    teacherId,
    startAt,
    endAt
  });

  // If package booking, validate package
  if (type === 'PACKAGE' && packageId) {
    const packageInfo = await prisma.package.findUnique({
      where: { 
        id: packageId,
        studentId,
        teacherId,
        status: 'CONFIRMED'
      }
    });

    if (!packageInfo) {
      throw new BookingError('Package not found or invalid', 'INVALID_PACKAGE');
    }

    if (packageInfo.lessonsRemaining <= 0) {
      throw new BookingError('No lessons remaining in package', 'PACKAGE_EXHAUSTED');
    }

    if (packageInfo.expiresAt && isBefore(packageInfo.expiresAt, now)) {
      throw new BookingError('Package has expired', 'PACKAGE_EXPIRED');
    }
  }
}

async function checkTimeSlotAvailability(params: {
  teacherId: string;
  startAt: Date;
  endAt: Date;
  excludeBookingId?: string;
}): Promise<void> {
  const { teacherId, startAt, endAt, excludeBookingId } = params;

  // Check for conflicting bookings
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      teacherId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      OR: [
        {
          startAt: { lte: startAt },
          endAt: { gt: startAt }
        },
        {
          startAt: { lt: endAt },
          endAt: { gte: endAt }
        },
        {
          startAt: { gte: startAt },
          endAt: { lte: endAt }
        }
      ]
    }
  });

  if (conflictingBooking) {
    throw new BookingError('Time slot is not available', 'SLOT_NOT_AVAILABLE');
  }

  // Check teacher availability rules
  const dayOfWeek = startAt.getDay();
  const timeString = format(startAt, 'HH:mm');

  const availabilityRule = await prisma.availabilityRule.findFirst({
    where: {
      teacherId,
      isOpen: true,
      OR: [
        {
          type: 'recurring',
          weekday: dayOfWeek,
          startTime: { lte: timeString },
          endTime: { gte: format(endAt, 'HH:mm') }
        },
        {
          type: 'one_off',
          date: startAt,
          startTime: { lte: timeString },
          endTime: { gte: format(endAt, 'HH:mm') }
        }
      ]
    }
  });

  if (!availabilityRule) {
    throw new BookingError('Teacher is not available at this time', 'TEACHER_NOT_AVAILABLE');
  }
}

function calculateCancellationPolicy(params: {
  booking: any;
  cancelledBy: string;
  minNoticeHours: number;
}): any {
  const { booking, cancelledBy, minNoticeHours } = params;
  
  const now = new Date();
  const hoursUntilLesson = (booking.startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let penalty = 0;
  let refundAmount = booking.priceAtBooking;
  let restorePackageLesson = false;

  // Apply cancellation policy based on notice time
  if (hoursUntilLesson < minNoticeHours) {
    if (cancelledBy === 'STUDENT') {
      // Student cancels with insufficient notice - penalty applies
      penalty = Math.round(booking.priceAtBooking * 0.5); // 50% penalty
      refundAmount = booking.priceAtBooking - penalty;
    } else {
      // Teacher cancels - full refund to student
      refundAmount = booking.priceAtBooking;
      restorePackageLesson = !!booking.packageId;
    }
  } else {
    // Sufficient notice - full refund
    refundAmount = booking.priceAtBooking;
    restorePackageLesson = !!booking.packageId;
  }

  return {
    penalty,
    refundAmount,
    restorePackageLesson,
    hoursUntilLesson: Math.round(hoursUntilLesson * 10) / 10
  };
}

async function sendBookingNotifications(booking: any, action: string): Promise<void> {
  try {
    const studentEmail = booking.student.user.email;
    const teacherEmail = booking.teacher.user.email;
    const studentPhone = booking.student.user.phone;
    const teacherPhone = booking.teacher.user.phone;

    const notificationData = {
      studentName: `${booking.student.firstName} ${booking.student.lastName}`,
      teacherName: `${booking.teacher.firstName} ${booking.teacher.lastName}`,
      subject: booking.subjectOffering.subjectName,
      date: format(booking.startAt, 'EEEE, MMMM d, yyyy'),
      time: format(booking.startAt, 'HH:mm'),
      duration: Math.round((booking.endAt.getTime() - booking.startAt.getTime()) / (1000 * 60)) + ' minutes',
      price: (booking.priceAtBooking / 100).toLocaleString() + ' UZS'
    };

    // Send emails
    if (action === 'created') {
      await Promise.all([
        sendEmail({
          to: studentEmail,
          subject: 'Booking Request Submitted',
          template: 'booking-confirmation',
          data: notificationData
        }),
        sendEmail({
          to: teacherEmail,
          subject: 'New Booking Request',
          template: 'booking-confirmation',
          data: notificationData
        })
      ]);
    }

    // Send SMS if available
    if (studentPhone && action === 'confirmed') {
      await sendSMS({
        to: studentPhone,
        message: `Your lesson with ${notificationData.teacherName} for ${notificationData.subject} has been confirmed for ${notificationData.date} at ${notificationData.time}.`
      });
    }

  } catch (error) {
    logger.error('Failed to send booking notifications', {
      bookingId: booking.id,
      action,
      error: error.message
    });
  }
}

export default router;
