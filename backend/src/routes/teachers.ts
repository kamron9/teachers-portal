import express from 'express';
import { body, query } from 'express-validator';
import { prisma } from '../lib/prisma';
import { validationMiddleware } from '../middleware/validation';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: O'qituvchilar ro'yxatini olish
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Fan nomi bo'yicha filter
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimal reyting
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maksimal narx
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Sahifadagi elementlar soni
 *     responses:
 *       200:
 *         description: O'qituvchilar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teachers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teacher'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('minRating').optional().isFloat({ min: 0, max: 5 }),
    query('maxPrice').optional().isFloat({ min: 0 })
  ],
  validationMiddleware,
  async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const subject = req.query.subject as string;
    const minRating = parseFloat(req.query.minRating as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);

    const skip = (page - 1) * limit;

    const where: any = {
      user: { status: 'ACTIVE' },
      isVerified: true
    };

    if (subject) {
      where.subjects = { has: subject };
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    if (maxPrice) {
      where.hourlyRate = { lte: maxPrice };
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        },
        orderBy: { rating: 'desc' }
      }),
      prisma.teacher.count({ where })
    ]);

    res.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: O'qituvchi ma'lumotlarini olish
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O'qituvchi ID
 *     responses:
 *       200:
 *         description: O'qituvchi ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: O'qituvchi topilmadi
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          isVerified: true
        }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!teacher) {
    throw new AppError('O\'qituvchi topilmadi', 404);
  }

  res.json(teacher);
});

/**
 * @swagger
 * /teachers/profile:
 *   put:
 *     summary: O'qituvchi profilini yangilash
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: integer
 *               hourlyRate:
 *                 type: number
 *               bio:
 *                 type: string
 *               education:
 *                 type: string
 *               availability:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profil muvaffaqiyatli yangilandi
 */
router.put('/profile', 
  [
    body('subjects').optional().isArray(),
    body('experience').optional().isInt({ min: 0 }),
    body('hourlyRate').optional().isFloat({ min: 0 }),
    body('bio').optional().isLength({ max: 1000 }),
    body('education').optional().isLength({ max: 500 })
  ],
  validationMiddleware,
  async (req, res) => {
    const userId = (req as any).user.id;
    const updateData = req.body;

    // Foydalanuvchi o'qituvchi ekanligini tekshirish
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'TEACHER') {
      throw new AppError('Faqat o\'qituvchilar bu amalni bajara oladi', 403);
    }

    const teacher = await prisma.teacher.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    logger.info('Teacher profile updated', { userId, teacherId: teacher.id });

    res.json({
      message: 'O\'qituvchi profili muvaffaqiyatli yangilandi',
      teacher
    });
  }
);

/**
 * @swagger
 * /teachers/availability:
 *   get:
 *     summary: O'qituvchi mavjudligini olish
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mavjudlik jadvali
 */
router.get('/availability', async (req, res) => {
  const userId = (req as any).user.id;

  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { availability: true }
  });

  if (!teacher) {
    throw new AppError('O\'qituvchi profili topilmadi', 404);
  }

  res.json(teacher.availability);
});

/**
 * @swagger
 * /teachers/availability:
 *   put:
 *     summary: O'qituvchi mavjudligini yangilash
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monday:
 *                 type: array
 *                 items:
 *                   type: string
 *               tuesday:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mavjudlik muvaffaqiyatli yangilandi
 */
router.put('/availability', async (req, res) => {
  const userId = (req as any).user.id;
  const availability = req.body;

  await prisma.teacher.update({
    where: { userId },
    data: { availability }
  });

  logger.info('Teacher availability updated', { userId });

  res.json({
    message: 'Mavjudlik muvaffaqiyatli yangilandi',
    availability
  });
});

export default router;
