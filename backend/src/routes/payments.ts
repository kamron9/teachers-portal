import express from 'express';
import { prisma } from '../lib/prisma';
import { requireRole, requireVerification } from '../middleware/auth';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation';
import { AppError, PaymentError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { 
  createPaymentSchema, 
  paymentWebhookSchema,
  paymentQuerySchema,
  refundSchema,
  payoutRequestSchema
} from '../validators/paymentValidators';
import { commonSchemas } from '../middleware/validation';
import { PaymentService } from '../services/paymentService';
import { config } from '../config';
import { sendEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import Joi from 'joi';

const router = express.Router();
const paymentService = new PaymentService();

// Create payment for booking (Student only)
router.post(
  '/',
  requireRole('STUDENT'),
  validateRequest(createPaymentSchema),
  async (req, res) => {
    const studentId = req.user!.id;
    const { 
      bookingId, 
      packageId, 
      provider, 
      returnUrl, 
      cancelUrl,
      paymentMethodId 
    } = req.body;

    // Validate that either bookingId or packageId is provided
    if (!bookingId && !packageId) {
      throw new PaymentError('Either booking ID or package ID is required', 'MISSING_PAYMENT_TARGET');
    }

    let amount = 0;
    let description = '';
    let targetEntity: any = null;

    // Get payment details based on target
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { 
          id: bookingId,
          studentId 
        },
        include: {
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
        throw new NotFoundError('Booking not found');
      }

      if (booking.status !== 'PENDING') {
        throw new PaymentError('Payment can only be made for pending bookings', 'INVALID_BOOKING_STATUS');
      }

      amount = booking.priceAtBooking;
      description = `Lesson: ${booking.subjectOffering.subjectName} with ${booking.teacher.firstName} ${booking.teacher.lastName}`;
      targetEntity = booking;
    } else if (packageId) {
      const packageInfo = await prisma.package.findUnique({
        where: { 
          id: packageId,
          studentId 
        },
        include: {
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

      if (!packageInfo) {
        throw new NotFoundError('Package not found');
      }

      if (packageInfo.status !== 'PENDING') {
        throw new PaymentError('Payment can only be made for pending packages', 'INVALID_PACKAGE_STATUS');
      }

      amount = packageInfo.priceTotal;
      description = `Package: ${packageInfo.lessonsTotal} lessons of ${packageInfo.subjectOffering.subjectName} with ${packageInfo.teacher.firstName} ${packageInfo.teacher.lastName}`;
      targetEntity = packageInfo;
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        packageId,
        amount,
        provider,
        status: 'PENDING',
        currency: 'UZS',
        metadata: {
          description,
          returnUrl,
          cancelUrl,
          paymentMethodId
        }
      }
    });

    try {
      // Process payment through selected provider
      const paymentResult = await paymentService.createPayment({
        paymentId: payment.id,
        amount,
        provider,
        description,
        returnUrl,
        cancelUrl,
        paymentMethodId,
        customerInfo: {
          id: studentId,
          email: req.user!.email
        }
      });

      // Update payment with provider reference
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          providerRef: paymentResult.providerRef,
          metadata: {
            ...payment.metadata,
            ...paymentResult.metadata
          }
        }
      });

      logger.info('Payment created', {
        paymentId: payment.id,
        studentId,
        amount,
        provider,
        bookingId,
        packageId
      });

      res.status(201).json({
        payment: {
          id: payment.id,
          amount,
          provider,
          status: 'PENDING'
        },
        paymentUrl: paymentResult.paymentUrl,
        providerRef: paymentResult.providerRef
      });

    } catch (error) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: 'FAILED',
          failureReason: error.message 
        }
      });

      throw new PaymentError(`Payment processing failed: ${error.message}`, 'PAYMENT_PROCESSING_FAILED');
    }
  }
);

// Get payment details
router.get(
  '/:paymentId',
  validateParams(Joi.object({ paymentId: commonSchemas.id })),
  async (req, res) => {
    const { paymentId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
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
            }
          }
        },
        package: {
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
            }
          }
        }
      }
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Check access permissions
    const studentId = payment.booking?.studentId || payment.package?.studentId;
    const teacherId = payment.booking?.teacherId || payment.package?.teacherId;

    if (userRole === 'STUDENT' && studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    res.json(payment);
  }
);

// Get payment history
router.get(
  '/',
  validateQuery(paymentQuerySchema),
  async (req, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { 
      status, 
      provider, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause based on user role
    let whereClause: any = {};
    
    if (userRole === 'STUDENT') {
      whereClause = {
        OR: [
          { booking: { studentId: userId } },
          { package: { studentId: userId } }
        ]
      };
    } else if (userRole === 'TEACHER') {
      whereClause = {
        OR: [
          { booking: { teacherId: userId } },
          { package: { teacherId: userId } }
        ]
      };
    } else if (userRole !== 'ADMIN') {
      throw new AppError('Invalid user role for payment access', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Add filters
    if (status) {
      whereClause.status = Array.isArray(status) ? { in: status } : status;
    }
    if (provider) {
      whereClause.provider = Array.isArray(provider) ? { in: provider } : provider;
    }
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where: whereClause,
        include: {
          booking: {
            include: {
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          },
          package: {
            include: {
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          }
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: limit
      }),

      prisma.payment.count({ where: whereClause })
    ]);

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Webhook endpoint for payment providers
router.post(
  '/webhook/:provider',
  validateParams(Joi.object({ provider: Joi.string().valid('CLICK', 'PAYME', 'UZUM_BANK', 'STRIPE').required() })),
  async (req, res) => {
    const { provider } = req.params;
    const webhookData = req.body;

    try {
      // Verify webhook signature
      const isValid = await paymentService.verifyWebhook(provider as any, req.headers, webhookData);
      
      if (!isValid) {
        throw new PaymentError('Invalid webhook signature', 'INVALID_WEBHOOK_SIGNATURE');
      }

      // Process webhook
      const result = await paymentService.processWebhook(provider as any, webhookData);

      if (result.paymentId) {
        await handlePaymentStatusUpdate(result.paymentId, result.status, result.metadata);
      }

      logger.info('Payment webhook processed', {
        provider,
        paymentId: result.paymentId,
        status: result.status
      });

      res.json({ received: true });

    } catch (error) {
      logger.error('Payment webhook processing failed', {
        provider,
        error: error.message,
        webhookData
      });

      res.status(400).json({ 
        error: 'Webhook processing failed',
        message: error.message 
      });
    }
  }
);

// Request refund (Student only)
router.post(
  '/:paymentId/refund',
  requireRole('STUDENT'),
  validateParams(Joi.object({ paymentId: commonSchemas.id })),
  validateRequest(refundSchema),
  async (req, res) => {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;
    const studentId = req.user!.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          where: { studentId }
        },
        package: {
          where: { studentId }
        }
      }
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new PaymentError('Only completed payments can be refunded', 'PAYMENT_NOT_REFUNDABLE');
    }

    const refundAmount = amount || payment.amount;
    
    if (refundAmount > payment.amount) {
      throw new PaymentError('Refund amount cannot exceed payment amount', 'INVALID_REFUND_AMOUNT');
    }

    try {
      // Process refund through payment provider
      const refundResult = await paymentService.processRefund({
        paymentId: payment.id,
        providerRef: payment.providerRef!,
        amount: refundAmount,
        reason,
        provider: payment.provider
      });

      // Update payment record
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: refundAmount === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
          refundedAt: new Date(),
          refundAmount: (payment.refundAmount || 0) + refundAmount,
          metadata: {
            ...payment.metadata,
            refunds: [
              ...(payment.metadata as any)?.refunds || [],
              {
                amount: refundAmount,
                reason,
                processedAt: new Date(),
                refundRef: refundResult.refundRef
              }
            ]
          }
        }
      });

      logger.info('Payment refund processed', {
        paymentId,
        studentId,
        refundAmount,
        reason
      });

      res.json({
        refund: {
          amount: refundAmount,
          status: refundResult.status,
          refundRef: refundResult.refundRef
        },
        payment: updatedPayment
      });

    } catch (error) {
      throw new PaymentError(`Refund processing failed: ${error.message}`, 'REFUND_PROCESSING_FAILED');
    }
  }
);

// Get teacher earnings (Teacher only)
router.get(
  '/earnings/summary',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateQuery(Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    status: Joi.string().valid('PENDING', 'AVAILABLE', 'PAID').optional()
  })),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { startDate, endDate, status } = req.query;

    const whereClause: any = { teacherId };
    
    if (status) {
      whereClause.status = status;
    }
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    const [earnings, totalStats] = await Promise.all([
      prisma.walletEntry.findMany({
        where: whereClause,
        include: {
          booking: {
            select: {
              id: true,
              startAt: true,
              student: {
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
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      prisma.walletEntry.aggregate({
        where: { teacherId },
        _sum: {
          amount: true,
          commission: true
        },
        _count: true
      })
    ]);

    const summary = {
      totalEarnings: totalStats._sum.amount || 0,
      totalCommission: totalStats._sum.commission || 0,
      netEarnings: (totalStats._sum.amount || 0) - (totalStats._sum.commission || 0),
      totalTransactions: totalStats._count,
      availableBalance: earnings
        .filter(e => e.status === 'AVAILABLE')
        .reduce((sum, e) => sum + e.amount, 0),
      pendingBalance: earnings
        .filter(e => e.status === 'PENDING')
        .reduce((sum, e) => sum + e.amount, 0)
    };

    res.json({
      summary,
      earnings: earnings.slice(0, 50), // Recent 50 entries
      pagination: {
        total: earnings.length,
        hasMore: earnings.length > 50
      }
    });
  }
);

// Request payout (Teacher only)
router.post(
  '/payout',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateRequest(payoutRequestSchema),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { amount, method, accountRef } = req.body;

    // Check available balance
    const availableBalance = await prisma.walletEntry.aggregate({
      where: {
        teacherId,
        status: 'AVAILABLE'
      },
      _sum: { amount: true }
    });

    const totalAvailable = availableBalance._sum.amount || 0;

    if (amount > totalAvailable) {
      throw new PaymentError('Insufficient available balance', 'INSUFFICIENT_BALANCE');
    }

    // Check for pending payouts
    const pendingPayout = await prisma.payout.findFirst({
      where: {
        teacherId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (pendingPayout) {
      throw new PaymentError('You have a pending payout request', 'PENDING_PAYOUT_EXISTS');
    }

    // Create payout request
    const payout = await prisma.payout.create({
      data: {
        teacherId,
        amount,
        method,
        accountRef,
        status: 'PENDING'
      }
    });

    logger.info('Payout request created', {
      payoutId: payout.id,
      teacherId,
      amount,
      method
    });

    res.status(201).json({
      payout,
      message: 'Payout request submitted successfully'
    });
  }
);

// Get payout history (Teacher only)
router.get(
  '/payouts',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateQuery(Joi.object({
    status: Joi.string().valid('PENDING', 'APPROVED', 'PAID', 'FAILED', 'REJECTED').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20)
  })),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { status, page = 1, limit = 20 } = req.query;

    const whereClause: any = { teacherId };
    if (status) {
      whereClause.status = status;
    }

    const skip = (page - 1) * limit;

    const [payouts, totalCount] = await Promise.all([
      prisma.payout.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),

      prisma.payout.count({ where: whereClause })
    ]);

    res.json({
      payouts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Helper function to handle payment status updates
async function handlePaymentStatusUpdate(
  paymentId: string, 
  status: string, 
  metadata?: any
): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true
                }
              }
            }
          },
          teacher: {
            select: {
              id: true
            }
          },
          subjectOffering: {
            select: {
              subjectName: true
            }
          }
        }
      },
      package: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  email: true,
                  phone: true
                }
              }
            }
          },
          teacher: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  if (!payment) {
    logger.error('Payment not found for status update', { paymentId });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Update payment status
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status,
        capturedAt: status === 'COMPLETED' ? new Date() : undefined,
        metadata: { ...payment.metadata, ...metadata }
      }
    });

    if (status === 'COMPLETED') {
      // Update booking/package status
      if (payment.bookingId) {
        await tx.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED' }
        });
      } else if (payment.packageId) {
        await tx.package.update({
          where: { id: payment.packageId },
          data: { status: 'CONFIRMED' }
        });
      }

      // Create wallet entry for teacher (after commission)
      const teacherId = payment.booking?.teacherId || payment.package?.teacherId;
      if (teacherId) {
        const commission = Math.round(payment.amount * config.platform.commissionRate);
        const netAmount = payment.amount - commission;

        await tx.walletEntry.create({
          data: {
            teacherId,
            bookingId: payment.bookingId,
            packageId: payment.packageId,
            amount: netAmount,
            commission,
            status: 'PENDING', // Will become available after lesson completion
            description: `Payment for ${payment.booking ? 'lesson' : 'package'}`
          }
        });
      }

      // Send confirmation notifications
      await sendPaymentConfirmations(payment);
    }
  });

  logger.info('Payment status updated', {
    paymentId,
    status,
    bookingId: payment.bookingId,
    packageId: payment.packageId
  });
}

async function sendPaymentConfirmations(payment: any): Promise<void> {
  try {
    const student = payment.booking?.student || payment.package?.student;
    const entity = payment.booking || payment.package;

    if (student?.user?.email) {
      await sendEmail({
        to: student.user.email,
        subject: 'Payment Confirmation',
        template: 'payment-confirmation',
        data: {
          amount: (payment.amount / 100).toLocaleString(),
          paymentMethod: payment.provider,
          transactionId: payment.providerRef,
          date: new Date().toLocaleDateString(),
          type: payment.booking ? 'lesson' : 'package'
        }
      });
    }

    if (student?.user?.phone) {
      await sendSMS({
        to: student.user.phone,
        message: `Payment of ${(payment.amount / 100).toLocaleString()} UZS has been processed successfully. Thank you!`
      });
    }

  } catch (error) {
    logger.error('Failed to send payment confirmations', {
      paymentId: payment.id,
      error: error.message
    });
  }
}

export default router;
