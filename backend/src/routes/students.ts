import express from "express";
import { body, query } from "express-validator";
import { prisma } from "../lib/prisma";
import { validationMiddleware } from "../middleware/validation";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

const router = express.Router();

/**
 * @swagger
 * /students/profile:
 *   get:
 *     summary: O'quvchi profilini olish
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: O'quvchi profili
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: string
 *                 learningGoals:
 *                   type: string
 *                 preferredLanguage:
 *                   type: string
 *                 timezone:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/profile", async (req, res) => {
  const userId = (req as any).user.id;

  // Foydalanuvchi o'quvchi ekanligini tekshirish
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "STUDENT") {
    throw new AppError("Faqat o'quvchilar bu amalni bajara oladi", 403);
  }

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          isVerified: true,
        },
      },
    },
  });

  if (!student) {
    // Agar student profili yo'q bo'lsa, bo'sh profil yaratish
    const newStudent = await prisma.student.create({
      data: {
        userId,
        interests: [],
        learningGoals: "",
        preferredLanguage: "uz",
        timezone: "Asia/Tashkent",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });

    return res.json(newStudent);
  }

  res.json(student);
});

/**
 * @swagger
 * /students/profile:
 *   put:
 *     summary: O'quvchi profilini yangilash
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *               learningGoals:
 *                 type: string
 *               preferredLanguage:
 *                 type: string
 *                 enum: [uz, ru, en]
 *               timezone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil muvaffaqiyatli yangilandi
 */
router.put(
  "/profile",
  [
    body("interests").optional().isArray(),
    body("learningGoals").optional().isLength({ max: 1000 }),
    body("preferredLanguage").optional().isIn(["uz", "ru", "en"]),
    body("timezone").optional().isString(),
  ],
  validationMiddleware,
  async (req, res) => {
    const userId = (req as any).user.id;
    const updateData = req.body;

    // Foydalanuvchi o'quvchi ekanligini tekshirish
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "STUDENT") {
      throw new AppError("Faqat o'quvchilar bu amalni bajara oladi", 403);
    }

    const student = await prisma.student.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        interests: updateData.interests || [],
        learningGoals: updateData.learningGoals || "",
        preferredLanguage: updateData.preferredLanguage || "uz",
        timezone: updateData.timezone || "Asia/Tashkent",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    logger.info("Student profile updated", { userId, studentId: student.id });

    res.json({
      message: "O'quvchi profili muvaffaqiyatli yangilandi",
      student,
    });
  },
);

/**
 * @swagger
 * /students/bookings:
 *   get:
 *     summary: O'quvchi darslarini olish
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED]
 *         description: Dars holati bo'yicha filter
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
 *         description: O'quvchi darslari ro'yxati
 */
router.get(
  "/bookings",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("status")
      .optional()
      .isIn(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED"]),
  ],
  validationMiddleware,
  async (req, res) => {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    // Student ID ni olish
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      throw new AppError("O'quvchi profili topilmadi", 404);
    }

    const where: any = { studentId: student.id };
    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: "desc" },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
);

/**
 * @swagger
 * /students/reviews:
 *   get:
 *     summary: O'quvchi yozgan sharhlar
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yozgan sharhlar ro'yxati
 */
router.get("/reviews", async (req, res) => {
  const userId = (req as any).user.id;

  // Student ID ni olish
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) {
    throw new AppError("O'quvchi profili topilmadi", 404);
  }

  const reviews = await prisma.review.findMany({
    where: { studentId: student.id },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      },
      booking: {
        select: {
          subject: true,
          scheduledAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

/**
 * @swagger
 * /students/favorites:
 *   get:
 *     summary: Sevimli o'qituvchilar
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sevimli o'qituvchilar ro'yxati
 */
router.get("/favorites", async (req, res) => {
  // Bu yerda sevimli o'qituvchilar logikasi bo'ladi
  // Hozircha bo'sh array qaytarish
  res.json([]);
});

/**
 * @swagger
 * /students/favorites/{teacherId}:
 *   post:
 *     summary: O'qituvchini sevimlilarga qo'shish
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sevimlilarga qo'shildi
 */
router.post("/favorites/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  // Bu yerda sevimlilar logikasi bo'ladi
  res.json({
    message: "O'qituvchi sevimlilarga qo'shildi",
  });
});

/**
 * @swagger
 * /students/favorites/{teacherId}:
 *   delete:
 *     summary: O'qituvchini sevimlilardan olib tashlash
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sevimlilardan olib tashlandi
 */
router.delete("/favorites/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  // Bu yerda sevimlilar logikasi bo'ladi
  res.json({
    message: "O'qituvchi sevimlilardan olib tashlandi",
  });
});

export default router;
