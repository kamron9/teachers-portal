import express from 'express';
import { prisma } from '../lib/prisma';
import { requireRole, requireVerification } from '../middleware/auth';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation';
import { AppError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { subjectOfferingSchema, teacherChipsSchema, updateOfferingSchema } from '../validators/subjectValidators';
import { commonSchemas } from '../middleware/validation';
import Joi from 'joi';

const router = express.Router();

// Get teacher's subject offerings
router.get(
  '/teacher/:teacherId',
  validateParams(Joi.object({ teacherId: commonSchemas.id })),
  async (req, res) => {
    const { teacherId } = req.params;

    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: {
        subjectOfferings: {
          where: { 
            deletedAt: null,
            ...(req.query.includeUnpublished ? {} : { status: 'PUBLISHED' })
          },
          orderBy: { orderIndex: 'asc' }
        },
        teacherChips: true,
      }
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    res.json({
      offerings: teacher.subjectOfferings,
      chips: teacher.teacherChips || { teachingLevels: [], examPreparation: [] }
    });
  }
);

// Create subject offering (Teacher only)
router.post(
  '/',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateRequest(subjectOfferingSchema),
  async (req, res) => {
    const teacherId = req.user!.id;
    
    // Check if teacher has reached the limit (12 offerings)
    const existingCount = await prisma.subjectOffering.count({
      where: {
        teacherId,
        deletedAt: null
      }
    });

    if (existingCount >= 12) {
      throw new AppError('Maximum 12 subject offerings allowed per teacher', 400, 'SUBJECT_LIMIT_EXCEEDED');
    }

    const { 
      subjectName, 
      subjectNameUz, 
      subjectNameRu, 
      subjectNameEn,
      level, 
      pricePerHour, 
      delivery, 
      icon,
      status = 'DRAFT'
    } = req.body;

    // Convert price to kopeks (UZS storage format)
    const priceInKopeks = Math.round(pricePerHour * 100);

    // Get next order index
    const maxOrderIndex = await prisma.subjectOffering.aggregate({
      where: { teacherId, deletedAt: null },
      _max: { orderIndex: true }
    });

    const offering = await prisma.subjectOffering.create({
      data: {
        teacherId,
        subjectName,
        subjectNameUz,
        subjectNameRu,
        subjectNameEn,
        level,
        pricePerHour: priceInKopeks,
        delivery,
        icon,
        status,
        orderIndex: (maxOrderIndex._max.orderIndex || 0) + 1
      }
    });

    logger.info('Subject offering created', {
      teacherId,
      offeringId: offering.id,
      subjectName,
      pricePerHour: priceInKopeks
    });

    res.status(201).json(offering);
  }
);

// Update subject offering (Teacher only)
router.put(
  '/:offeringId',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateParams(Joi.object({ offeringId: commonSchemas.id })),
  validateRequest(updateOfferingSchema),
  async (req, res) => {
    const { offeringId } = req.params;
    const teacherId = req.user!.id;

    const offering = await prisma.subjectOffering.findFirst({
      where: {
        id: offeringId,
        teacherId,
        deletedAt: null
      }
    });

    if (!offering) {
      throw new NotFoundError('Subject offering not found');
    }

    const updateData: any = { ...req.body };
    
    // Convert price to kopeks if provided
    if (updateData.pricePerHour) {
      updateData.pricePerHour = Math.round(updateData.pricePerHour * 100);
    }

    const updatedOffering = await prisma.subjectOffering.update({
      where: { id: offeringId },
      data: updateData
    });

    logger.info('Subject offering updated', {
      teacherId,
      offeringId,
      updates: Object.keys(updateData)
    });

    res.json(updatedOffering);
  }
);

// Delete subject offering (Teacher only)
router.delete(
  '/:offeringId',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateParams(Joi.object({ offeringId: commonSchemas.id })),
  async (req, res) => {
    const { offeringId } = req.params;
    const teacherId = req.user!.id;

    const offering = await prisma.subjectOffering.findFirst({
      where: {
        id: offeringId,
        teacherId,
        deletedAt: null
      }
    });

    if (!offering) {
      throw new NotFoundError('Subject offering not found');
    }

    // Soft delete
    await prisma.subjectOffering.update({
      where: { id: offeringId },
      data: { 
        deletedAt: new Date(),
        status: 'ARCHIVED'
      }
    });

    logger.info('Subject offering deleted', {
      teacherId,
      offeringId
    });

    res.json({ message: 'Subject offering deleted successfully' });
  }
);

// Reorder subject offerings (Teacher only)
router.post(
  '/reorder',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateRequest(Joi.object({
    offeringIds: Joi.array().items(Joi.string().uuid()).min(1).required()
  })),
  async (req, res) => {
    const { offeringIds } = req.body;
    const teacherId = req.user!.id;

    // Verify all offerings belong to the teacher
    const offerings = await prisma.subjectOffering.findMany({
      where: {
        id: { in: offeringIds },
        teacherId,
        deletedAt: null
      }
    });

    if (offerings.length !== offeringIds.length) {
      throw new AppError('Some offerings not found or do not belong to you', 400, 'INVALID_OFFERINGS');
    }

    // Update order indices
    const updatePromises = offeringIds.map((id, index) =>
      prisma.subjectOffering.update({
        where: { id },
        data: { orderIndex: index + 1 }
      })
    );

    await Promise.all(updatePromises);

    logger.info('Subject offerings reordered', {
      teacherId,
      offeringIds
    });

    res.json({ message: 'Offerings reordered successfully' });
  }
);

// Update teacher chips (Teaching Levels & Exam Preparation)
router.put(
  '/chips',
  requireRole('TEACHER'),
  requireVerification('teacher'),
  validateRequest(teacherChipsSchema),
  async (req, res) => {
    const teacherId = req.user!.id;
    const { teachingLevels, examPreparation } = req.body;

    const chips = await prisma.teacherChips.upsert({
      where: { teacherId },
      update: {
        teachingLevels,
        examPreparation
      },
      create: {
        teacherId,
        teachingLevels,
        examPreparation
      }
    });

    logger.info('Teacher chips updated', {
      teacherId,
      teachingLevels: teachingLevels.length,
      examPreparation: examPreparation.length
    });

    res.json(chips);
  }
);

// Get subject offerings by IDs (for booking)
router.post(
  '/by-ids',
  validateRequest(Joi.object({
    offeringIds: Joi.array().items(Joi.string().uuid()).min(1).max(10).required()
  })),
  async (req, res) => {
    const { offeringIds } = req.body;

    const offerings = await prisma.subjectOffering.findMany({
      where: {
        id: { in: offeringIds },
        status: 'PUBLISHED',
        deletedAt: null
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            verificationStatus: true
          }
        }
      }
    });

    res.json(offerings);
  }
);

// Get popular subjects (aggregated data)
router.get('/popular', async (req, res) => {
  const popularSubjects = await prisma.subjectOffering.groupBy({
    by: ['subjectName'],
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      teacher: {
        verificationStatus: 'APPROVED'
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  });

  res.json(popularSubjects.map(subject => ({
    name: subject.subjectName,
    teacherCount: subject._count.id
  })));
});

// Get subject statistics for admin
router.get(
  '/stats',
  requireRole('ADMIN'),
  async (req, res) => {
    const stats = await prisma.$transaction([
      // Total offerings by status
      prisma.subjectOffering.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { id: true }
      }),
      
      // Average price by subject
      prisma.subjectOffering.groupBy({
        by: ['subjectName'],
        where: {
          status: 'PUBLISHED',
          deletedAt: null
        },
        _avg: { pricePerHour: true },
        _count: { id: true }
      }),
      
      // Price distribution
      prisma.subjectOffering.aggregate({
        where: {
          status: 'PUBLISHED',
          deletedAt: null
        },
        _min: { pricePerHour: true },
        _max: { pricePerHour: true },
        _avg: { pricePerHour: true }
      })
    ]);

    res.json({
      statusDistribution: stats[0],
      subjectAverages: stats[1].map(s => ({
        subject: s.subjectName,
        averagePrice: s._avg.pricePerHour ? Math.round(s._avg.pricePerHour / 100) : 0,
        offeringCount: s._count.id
      })),
      priceStatistics: {
        min: stats[2]._min.pricePerHour ? Math.round(stats[2]._min.pricePerHour / 100) : 0,
        max: stats[2]._max.pricePerHour ? Math.round(stats[2]._max.pricePerHour / 100) : 0,
        average: stats[2]._avg.pricePerHour ? Math.round(stats[2]._avg.pricePerHour / 100) : 0,
      }
    });
  }
);

export default router;
