import express from 'express';
import { prisma } from '../lib/prisma';
import { requireRole } from '../middleware/auth';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation';
import { AppError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { 
  createMessageSchema, 
  messageQuerySchema,
  createThreadSchema,
  reportMessageSchema 
} from '../validators/messageValidators';
import { commonSchemas } from '../middleware/validation';
import { io } from '../index';
import Joi from 'joi';

const router = express.Router();

// Get message threads for user
router.get(
  '/threads',
  validateQuery(messageQuerySchema.threadsQuery),
  async (req, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { page = 1, limit = 20, search, unreadOnly = false } = req.query;

    // Build where clause based on user role
    let whereClause: any = {};
    
    if (userRole === 'STUDENT') {
      whereClause.studentId = userId;
    } else if (userRole === 'TEACHER') {
      whereClause.teacherId = userId;
    } else {
      throw new AppError('Invalid user role for messaging', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    if (search) {
      const otherUserField = userRole === 'STUDENT' ? 'teacher' : 'student';
      whereClause[otherUserField] = {
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } }
        ]
      };
    }

    if (unreadOnly) {
      whereClause.messages = {
        some: {
          status: { not: 'READ' },
          senderId: { not: userId }
        }
      };
    }

    const skip = (page - 1) * limit;

    const [threads, totalCount] = await Promise.all([
      prisma.messageThread.findMany({
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
          booking: {
            select: {
              id: true,
              startAt: true,
              status: true,
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              senderId: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: userId },
                  status: { not: 'READ' }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),

      prisma.messageThread.count({ where: whereClause })
    ]);

    res.json({
      threads: threads.map(thread => ({
        ...thread,
        lastMessage: thread.messages[0] || null,
        unreadCount: thread._count.messages
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Get specific thread messages
router.get(
  '/threads/:threadId',
  validateParams(Joi.object({ threadId: commonSchemas.id })),
  validateQuery(messageQuerySchema.messagesQuery),
  async (req, res) => {
    const { threadId } = req.params;
    const { page = 1, limit = 50, before, after } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify thread access
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
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
        booking: {
          select: {
            id: true,
            startAt: true,
            status: true,
            subjectOffering: {
              select: {
                subjectName: true
              }
            }
          }
        }
      }
    });

    if (!thread) {
      throw new NotFoundError('Message thread not found');
    }

    // Check access permissions
    if (userRole === 'STUDENT' && thread.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && thread.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Build message query
    let messageWhere: any = { threadId };
    
    if (before) {
      messageWhere.createdAt = { lt: new Date(before as string) };
    }
    if (after) {
      messageWhere.createdAt = { gt: new Date(after as string) };
    }

    const skip = (page - 1) * limit;

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: messageWhere,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),

      prisma.message.count({ where: messageWhere })
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        threadId,
        senderId: { not: userId },
        status: { not: 'READ' }
      },
      data: { status: 'READ' }
    });

    res.json({
      thread,
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

// Create new message thread
router.post(
  '/threads',
  validateRequest(createThreadSchema),
  async (req, res) => {
    const { studentId, teacherId, bookingId, initialMessage } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Validate user permissions
    if (userRole === 'STUDENT' && studentId !== userId) {
      throw new AppError('Students can only create threads for themselves', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && teacherId !== userId) {
      throw new AppError('Teachers can only create threads for themselves', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Check if thread already exists
    const existingThread = await prisma.messageThread.findFirst({
      where: {
        studentId,
        teacherId,
        ...(bookingId && { bookingId })
      }
    });

    if (existingThread) {
      throw new AppError('Message thread already exists', 409, 'THREAD_ALREADY_EXISTS');
    }

    // Verify student and teacher exist
    const [student, teacher] = await Promise.all([
      prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { id: true, firstName: true, lastName: true }
      }),
      prisma.teacherProfile.findUnique({
        where: { id: teacherId, verificationStatus: 'APPROVED' },
        select: { id: true, firstName: true, lastName: true }
      })
    ]);

    if (!student) {
      throw new NotFoundError('Student not found');
    }
    if (!teacher) {
      throw new NotFoundError('Teacher not found or not verified');
    }

    // If booking is specified, verify it exists and belongs to these users
    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          studentId,
          teacherId
        }
      });

      if (!booking) {
        throw new NotFoundError('Booking not found or does not belong to these users');
      }
    }

    // Create thread and initial message in transaction
    const result = await prisma.$transaction(async (tx) => {
      const thread = await tx.messageThread.create({
        data: {
          studentId,
          teacherId,
          bookingId
        },
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
          booking: {
            select: {
              id: true,
              startAt: true,
              status: true,
              subjectOffering: {
                select: {
                  subjectName: true
                }
              }
            }
          }
        }
      });

      let message = null;
      if (initialMessage?.trim()) {
        message = await tx.message.create({
          data: {
            threadId: thread.id,
            senderId: userId,
            content: initialMessage.trim(),
            status: 'SENT'
          }
        });
      }

      return { thread, message };
    });

    // Send real-time notification
    const recipientId = userRole === 'STUDENT' ? teacherId : studentId;
    io.to(`user_${recipientId}`).emit('new_thread', {
      thread: result.thread,
      message: result.message
    });

    logger.info('Message thread created', {
      threadId: result.thread.id,
      studentId,
      teacherId,
      bookingId,
      createdBy: userId
    });

    res.status(201).json({
      thread: result.thread,
      message: result.message
    });
  }
);

// Send message
router.post(
  '/threads/:threadId/messages',
  validateParams(Joi.object({ threadId: commonSchemas.id })),
  validateRequest(createMessageSchema),
  async (req, res) => {
    const { threadId } = req.params;
    const { content, attachments = [] } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify thread exists and user has access
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
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
    });

    if (!thread) {
      throw new NotFoundError('Message thread not found');
    }

    // Check permissions
    if (userRole === 'STUDENT' && thread.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && thread.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Check if thread is active
    if (!thread.isActive) {
      throw new AppError('Cannot send message to inactive thread', 400, 'THREAD_INACTIVE');
    }

    // Create message
    const message = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: {
          threadId,
          senderId: userId,
          content: content.trim(),
          attachments,
          status: 'SENT'
        }
      });

      // Update thread timestamp
      await tx.messageThread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() }
      });

      return newMessage;
    });

    // Send real-time notification
    const recipientId = userRole === 'STUDENT' ? thread.teacherId : thread.studentId;
    const senderName = userRole === 'STUDENT' 
      ? `${thread.student.firstName} ${thread.student.lastName}`
      : `${thread.teacher.firstName} ${thread.teacher.lastName}`;

    io.to(`user_${recipientId}`).emit('new_message', {
      threadId,
      message,
      senderName
    });

    logger.info('Message sent', {
      messageId: message.id,
      threadId,
      senderId: userId,
      contentLength: content.length,
      attachmentCount: attachments.length
    });

    res.status(201).json(message);
  }
);

// Mark messages as read
router.patch(
  '/threads/:threadId/read',
  validateParams(Joi.object({ threadId: commonSchemas.id })),
  validateRequest(Joi.object({
    messageIds: Joi.array()
      .items(Joi.string().uuid())
      .optional()
      .messages({
        'array.base': 'Message IDs must be an array',
        'string.uuid': 'Each message ID must be a valid UUID'
      })
  })),
  async (req, res) => {
    const { threadId } = req.params;
    const { messageIds } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify thread access
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId }
    });

    if (!thread) {
      throw new NotFoundError('Message thread not found');
    }

    if (userRole === 'STUDENT' && thread.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && thread.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Build update query
    let whereClause: any = {
      threadId,
      senderId: { not: userId }, // Only mark messages from other user as read
      status: { not: 'READ' }
    };

    if (messageIds && messageIds.length > 0) {
      whereClause.id = { in: messageIds };
    }

    const updatedCount = await prisma.message.updateMany({
      where: whereClause,
      data: { status: 'READ' }
    });

    // Emit read receipt
    const recipientId = userRole === 'STUDENT' ? thread.teacherId : thread.studentId;
    io.to(`user_${recipientId}`).emit('messages_read', {
      threadId,
      readBy: userId,
      messageIds: messageIds || 'all'
    });

    logger.info('Messages marked as read', {
      threadId,
      userId,
      updatedCount: updatedCount.count
    });

    res.json({
      message: 'Messages marked as read',
      updatedCount: updatedCount.count
    });
  }
);

// Report message
router.post(
  '/messages/:messageId/report',
  validateParams(Joi.object({ messageId: commonSchemas.id })),
  validateRequest(reportMessageSchema),
  async (req, res) => {
    const { messageId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user!.id;

    // Verify message exists and user has access to the thread
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        thread: {
          select: {
            id: true,
            studentId: true,
            teacherId: true
          }
        }
      }
    });

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Check if user is part of the thread
    const userRole = req.user!.role;
    if (userRole === 'STUDENT' && message.thread.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && message.thread.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Check if user is trying to report their own message
    if (message.senderId === userId) {
      throw new AppError('Cannot report your own message', 400, 'CANNOT_REPORT_OWN_MESSAGE');
    }

    // Mark message as reported
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { isReported: true }
    });

    // Create admin notification/audit log for moderation
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REPORT_MESSAGE',
        resource: 'message',
        resourceId: messageId,
        newValues: { reason, description },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    logger.warn('Message reported', {
      messageId,
      reportedBy: userId,
      reason,
      threadId: message.thread.id
    });

    res.json({
      message: 'Message reported successfully',
      reportId: messageId // In production, create separate report entity
    });
  }
);

// Archive/deactivate thread
router.patch(
  '/threads/:threadId/archive',
  validateParams(Joi.object({ threadId: commonSchemas.id })),
  async (req, res) => {
    const { threadId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify thread access
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId }
    });

    if (!thread) {
      throw new NotFoundError('Message thread not found');
    }

    if (userRole === 'STUDENT' && thread.studentId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }
    if (userRole === 'TEACHER' && thread.teacherId !== userId) {
      throw new AppError('Access denied', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Archive thread
    const updatedThread = await prisma.messageThread.update({
      where: { id: threadId },
      data: { isActive: false }
    });

    logger.info('Message thread archived', {
      threadId,
      archivedBy: userId
    });

    res.json({
      message: 'Thread archived successfully',
      thread: updatedThread
    });
  }
);

// Get unread message count
router.get(
  '/unread-count',
  async (req, res) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};
    
    if (userRole === 'STUDENT') {
      whereClause = {
        thread: { studentId: userId },
        senderId: { not: userId },
        status: { not: 'READ' }
      };
    } else if (userRole === 'TEACHER') {
      whereClause = {
        thread: { teacherId: userId },
        senderId: { not: userId },
        status: { not: 'read' }
      };
    } else {
      throw new AppError('Invalid user role for messaging', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    const unreadCount = await prisma.message.count({
      where: whereClause
    });

    res.json({ unreadCount });
  }
);

// Search messages
router.get(
  '/search',
  validateQuery(Joi.object({
    query: Joi.string().min(1).max(100).required(),
    threadId: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20)
  })),
  async (req, res) => {
    const { query, threadId, page = 1, limit = 20 } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Build search query
    let whereClause: any = {
      content: {
        contains: query as string,
        mode: 'insensitive'
      }
    };

    // Filter by user's threads
    if (userRole === 'STUDENT') {
      whereClause.thread = { studentId: userId };
    } else if (userRole === 'TEACHER') {
      whereClause.thread = { teacherId: userId };
    }

    // Filter by specific thread if provided
    if (threadId) {
      whereClause.threadId = threadId;
    }

    const skip = (page - 1) * limit;

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: whereClause,
        include: {
          thread: {
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),

      prisma.message.count({ where: whereClause })
    ]);

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  }
);

export default router;
