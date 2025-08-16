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

  return app;
}
