import express from 'express';
import { body } from 'express-validator';
import { prisma } from '../lib/prisma';
import { validationMiddleware } from '../middleware/validation';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Foydalanuvchi profilini olish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi profili
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', async (req, res) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatar: true,
      isVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError('Foydalanuvchi topilmadi', 404);
  }

  res.json(user);
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Foydalanuvchi profilini yangilash
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profil muvaffaqiyatli yangilandi
 */
router.put('/profile', 
  [
    body('firstName').optional().isLength({ min: 2, max: 50 }),
    body('lastName').optional().isLength({ min: 2, max: 50 }),
    body('phone').optional().isMobilePhone('uz-UZ'),
    body('avatar').optional().isURL()
  ],
  validationMiddleware,
  async (req, res) => {
    const userId = (req as any).user.id;
    const { firstName, lastName, phone, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isVerified: true,
        status: true,
        updatedAt: true
      }
    });

    logger.info('User profile updated', { userId });

    res.json({
      message: 'Profil muvaffaqiyatli yangilandi',
      user: updatedUser
    });
  }
);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Parolni o'zgartirish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli o'zgartirildi
 */
router.put('/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Joriy parol talab qilinadi'),
    body('newPassword').isLength({ min: 8 }).withMessage('Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak')
  ],
  validationMiddleware,
  async (req, res) => {
    // Bu yerda parol o'zgartirish logikasi bo'ladi
    res.json({
      message: 'Parol muvaffaqiyatli o\'zgartirildi'
    });
  }
);

/**
 * @swagger
 * /users/delete-account:
 *   delete:
 *     summary: Hisobni o'chirish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hisob muvaffaqiyatli o'chirildi
 */
router.delete('/delete-account', async (req, res) => {
  const userId = (req as any).user.id;

  // Hisobni o'chirish o'rniga status ni o'zgartirish
  await prisma.user.update({
    where: { id: userId },
    data: { status: 'INACTIVE' }
  });

  logger.info('User account deactivated', { userId });

  res.json({
    message: 'Hisob muvaffaqiyatli o\'chirildi'
  });
});

export default router;
