import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
const PORT = 3001;

// CORS
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());

// Swagger konfiguratsiyasi
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TutorUZ API",
      version: "1.0.0",
      description: "O'zbekiston uchun rep-tutorlar bozori API hujjatlari",
      contact: {
        name: "TutorUZ Support",
        email: "support@tutoruz.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["STUDENT", "TEACHER", "ADMIN"] },
            avatar: { type: "string", format: "uri" },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: { type: "string", example: "password123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
        Teacher: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            subjects: { type: "array", items: { type: "string" } },
            experience: { type: "integer" },
            hourlyRate: { type: "number" },
            bio: { type: "string" },
            rating: { type: "number", minimum: 0, maximum: 5 },
            totalReviews: { type: "integer" },
            isVerified: { type: "boolean" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            studentId: { type: "string", format: "uuid" },
            teacherId: { type: "string", format: "uuid" },
            subject: { type: "string" },
            scheduledAt: { type: "string", format: "date-time" },
            duration: { type: "integer" },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
            },
            amount: { type: "number" },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Foydalanuvchi autentifikatsiyasi",
      },
      { name: "Teachers", description: "O'qituvchilar boshqaruvi" },
      { name: "Students", description: "O'quvchilar boshqaruvi" },
      { name: "Bookings", description: "Dars bron qilish" },
      { name: "Payments", description: "To'lovlar tizimi" },
    ],
  },
  apis: ["./simple-server.ts"],
};

const specs = swaggerJSDoc(swaggerOptions);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #1f2937; }
  `,
    customSiteTitle: "TutorUZ API Documentation",
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirdi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Noto'g'ri email yoki parol
 */
app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Mock authentication
  if (email === "test@tutoruz.com" && password === "password123") {
    res.json({
      message: "Muvaffaqiyatli kirdingiz",
      user: {
        id: "1",
        email: "test@tutoruz.com",
        firstName: "Test",
        lastName: "User",
        role: "STUDENT",
        isVerified: true,
      },
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
    });
  } else {
    res.status(401).json({
      error: "InvalidCredentials",
      message: "Noto'g'ri email yoki parol",
    });
  }
});

/**
 * @swagger
 * /api/v1/teachers:
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
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sahifa raqami
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
 *                     page: { type: 'integer' }
 *                     total: { type: 'integer' }
 */
app.get("/api/v1/teachers", (req, res) => {
  // Mock teachers data
  const teachers = [
    {
      id: "1",
      subjects: ["Matematika", "Fizika"],
      experience: 5,
      hourlyRate: 50000,
      bio: "Tajribali matematik va fizik fanlar o'qituvchisi",
      rating: 4.8,
      totalReviews: 45,
      isVerified: true,
      user: {
        firstName: "Ahmadjon",
        lastName: "Karimov",
        avatar: null,
      },
    },
    {
      id: "2",
      subjects: ["Ingliz tili"],
      experience: 3,
      hourlyRate: 40000,
      bio: "IELTS va ingliz tili mutaxassisi",
      rating: 4.9,
      totalReviews: 32,
      isVerified: true,
      user: {
        firstName: "Malika",
        lastName: "Yusupova",
        avatar: null,
      },
    },
  ];

  res.json({
    teachers,
    pagination: {
      page: 1,
      total: teachers.length,
    },
  });
});

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Yangi dars bron qilish
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teacherId, subject, scheduledAt, duration]
 *             properties:
 *               teacherId: { type: string }
 *               subject: { type: string }
 *               scheduledAt: { type: string, format: date-time }
 *               duration: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Dars muvaffaqiyatli bron qilindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
app.post("/api/v1/bookings", (req, res) => {
  const bookingData = req.body;

  const booking = {
    id: "1",
    ...bookingData,
    status: "PENDING",
    amount: 50000,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    message: "Dars muvaffaqiyatli bron qilindi",
    booking,
  });
});

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: To'lov amalga oshirish
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, amount, method]
 *             properties:
 *               bookingId: { type: string }
 *               amount: { type: number }
 *               method: { type: string, enum: ['CARD', 'UZCARD', 'HUMO'] }
 *     responses:
 *       200:
 *         description: To'lov muvaffaqiyatli amalga oshirildi
 */
app.post("/api/v1/payments", (req, res) => {
  const { bookingId, amount, method } = req.body;

  res.json({
    message: "To'lov muvaffaqiyatli amalga oshirildi",
    payment: {
      id: "1",
      bookingId,
      amount,
      method,
      status: "COMPLETED",
      transactionId: "TXN_" + Date.now(),
      createdAt: new Date().toISOString(),
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.originalUrl} topilmadi`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portida ishlamoqda`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
});

export default app;
