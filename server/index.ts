import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Health check
  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  // Auth endpoints
  app.get("/api/v1/auth/me", (_req, res) => {
    res.json({
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "TEACHER",
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  });

  app.post("/api/v1/auth/login", (_req, res) => {
    res.json({
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "TEACHER",
        isVerified: true
      },
      accessToken: "mock-jwt-token",
      refreshToken: "mock-refresh-token"
    });
  });

  // Teacher endpoints
  app.get("/api/v1/teachers", (_req, res) => {
    res.json({
      teachers: [{
        id: "teacher-1",
        userId: "user-1",
        firstName: "John",
        lastName: "Doe",
        bio: "Experienced English teacher with 10+ years of experience",
        subjects: ["English", "IELTS"],
        hourlyRate: 50000,
        timezone: "Asia/Tashkent",
        rating: 4.8,
        totalReviews: 156,
        totalLessons: 890,
        responseTime: "Usually responds within 1 hour",
        profileCompletion: 85,
        verificationStatus: "APPROVED"
      }],
      total: 1,
      page: 1,
      limit: 10,
      pages: 1
    });
  });

  // Booking endpoints
  app.get("/api/v1/bookings", (_req, res) => {
    res.json({
      bookings: [{
        id: "booking-1",
        studentId: "student-1",
        teacherId: "teacher-1",
        status: "CONFIRMED",
        startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        subject: "English Conversation",
        price: 50000,
        createdAt: new Date().toISOString()
      }],
      total: 1
    });
  });

  app.post("/api/v1/bookings", (_req, res) => {
    res.status(201).json({
      id: `booking-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      message: "Booking created successfully"
    });
  });

  // Availability endpoints (without parameterized routes for now)
  app.post("/api/v1/availability", (req, res) => {
    res.status(201).json({
      id: `rule-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    });
  });

  // Mock availability data for specific teacher
  app.get("/api/v1/availability/user-1", (_req, res) => {
    res.json({
      rules: [{
        id: "rule-1",
        type: "recurring",
        weekday: 1,
        startTime: "09:00",
        endTime: "17:00",
        isOpen: true
      }, {
        id: "rule-2",
        type: "recurring",
        weekday: 2,
        startTime: "09:00",
        endTime: "17:00",
        isOpen: true
      }],
      bookings: [{
        startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        status: "CONFIRMED"
      }],
      timezone: "Asia/Tashkent"
    });
  });

  // Available slots
  app.get("/api/v1/availability/user-1/slots", (_req, res) => {
    const now = new Date();
    const slots = [];

    // Generate some mock available slots for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      for (let hour = 9; hour < 17; hour += 2) {
        const startAt = new Date(date);
        startAt.setHours(hour, 0, 0, 0);
        const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

        slots.push({
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          duration: 60,
          available: true
        });
      }
    }

    res.json({
      slots: slots.slice(0, 20),
      timezone: "Asia/Tashkent",
      duration: 60,
      teacher: { id: "user-1" }
    });
  });

  // Subject offerings
  app.get("/api/v1/subjects/offerings", (_req, res) => {
    res.json({
      offerings: [{
        id: "offering-1",
        teacherId: "teacher-1",
        subjectName: "English",
        level: "INTERMEDIATE",
        price: 50000,
        duration: 60,
        deliveryType: "ONLINE",
        description: "Conversational English for intermediate students"
      }]
    });
  });

  // Reviews
  app.get("/api/v1/reviews", (_req, res) => {
    res.json({
      reviews: [{
        id: "review-1",
        studentId: "student-1",
        teacherId: "teacher-1",
        rating: 5,
        comment: "Excellent teacher! Very patient and knowledgeable.",
        createdAt: new Date().toISOString()
      }],
      total: 1
    });
  });

  app.post("/api/v1/reviews", (req, res) => {
    res.status(201).json({
      id: `review-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    });
  });

  // Messages
  app.get("/api/v1/messages", (_req, res) => {
    res.json({
      messages: [],
      total: 0
    });
  });

  // Notifications
  app.get("/api/v1/notifications", (_req, res) => {
    res.json({
      notifications: [],
      total: 0,
      unreadCount: 0
    });
  });

  return app;
}
