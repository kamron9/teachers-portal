import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { authValidators } from "../validators/authValidators";
import { validateRequest } from "../middleware/validation";
import { authMiddleware } from "../middleware/auth";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: Abdulloh
 *               lastName:
 *                 type: string
 *                 example: Xushvaqtov
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               role:
 *                 type: string
 *                 enum: [STUDENT, TEACHER]
 *                 example: STUDENT
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Muvaffaqiyatli ro'yxatdan o'tdingiz
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email allaqachon mavjud
 */
router.post(
  "/register",
  validateRequest(authValidators.registerSchema),
  async (req, res) => {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Email tekshirish
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Bu email allaqachon ro'yxatdan o'tgan", 409);
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 12);

    // Foydalanuvchi yaratish
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        role: role as "STUDENT" | "TEACHER",
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        status: true,
        createdAt: true,
      },
    });

    // Profile yaratish
    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });
    } else if (role === "TEACHER") {
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });
    }

    // Token yaratish
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn },
    );

    logger.info("User registered successfully", { userId: user.id, email });

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      user,
      accessToken,
      refreshToken,
    });
  },
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Muvaffaqiyatli kirdingiz
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Noto'g'ri email yoki parol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/login",
  validateRequest(authValidators.loginSchema),
  async (req, res) => {
    const { email, password } = req.body;

    // Foydalanuvchini topish
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        phone: true,
        role: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        studentProfile: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        teacherProfile: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Noto'g'ri email yoki parol", 401);
    }

    // Parolni tekshirish
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Noto'g'ri email yoki parol", 401);
    }

    // Faol emasligini tekshirish
    if (user.status !== "ACTIVE") {
      throw new AppError("Hisobingiz faol emas. Admin bilan bog'laning", 403);
    }

    // Token yaratish
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn },
    );

    // Parolni response dan olib tashlash
    const { password: _, ...userWithoutPassword } = user;

    logger.info("User logged in successfully", { userId: user.id, email });

    res.json({
      message: "Muvaffaqiyatli kirdingiz",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  },
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Access token yangilash
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Noto'g'ri refresh token
 */
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token talab qilinadi", 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new AppError("Foydalanuvchi topilmadi yoki faol emas", 401);
    }

    // Yangi tokenlar yaratish
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn },
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw new AppError("Noto'g'ri refresh token", 401);
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumotlarini olish
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Autentifikatsiya talab qilinadi
 */
router.get("/profile", authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      emailVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      studentProfile: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      teacherProfile: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("Foydalanuvchi topilmadi", 404);
  }

  res.json(user);
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Tizimdan chiqish
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Muvaffaqiyatli chiqdingiz
 */
router.post("/logout", authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;

  logger.info("User logged out", { userId });

  res.json({
    message: "Muvaffaqiyatli chiqdingiz",
  });
});

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Email tasdiqlash
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email tasdiqlash tokeni
 *     responses:
 *       200:
 *         description: Email muvaffaqiyatli tasdiqlandi
 *       400:
 *         description: Noto'g'ri yoki muddati tugagan token
 */
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError("Tasdiqlash tokeni talab qilinadi", 400);
  }

  // Bu yerda email tasdiqlash logikasi bo'ladi
  // Hozircha mock response
  res.json({
    message: "Email muvaffaqiyatli tasdiqlandi",
  });
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Parolni tiklash so'rovi
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Parol tiklash havolasi yuborildi
 */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Email mavjudligini tekshirish
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Xavfsizlik uchun har doim muvaffaqiyatli javoб qaytaramiz
  res.json({
    message: "Agar email mavjud bo'lsa, parol tiklash havolasi yuborildi",
  });
});

export default router;
