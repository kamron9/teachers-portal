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

  // Basic tutoring API routes with mock data
  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  app.get("/api/v1/auth/me", (_req, res) => {
    res.json({
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "TEACHER",
        isVerified: true
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
      accessToken: "mock-jwt-token"
    });
  });

  app.get("/api/v1/teachers", (_req, res) => {
    res.json({
      teachers: [{
        id: "teacher-1",
        firstName: "John",
        lastName: "Doe",
        bio: "Experienced English teacher",
        subjects: ["English"],
        hourlyRate: 50000,
        rating: 4.8,
        totalReviews: 156
      }],
      total: 1
    });
  });

  app.get("/api/v1/bookings", (_req, res) => {
    res.json({
      bookings: [],
      total: 0
    });
  });

  // Generic 404 handler for API routes
  app.use("/api/v1/*", (req, res) => {
    res.status(404).json({
      error: "NotFound",
      message: `API endpoint ${req.originalUrl} not found`
    });
  });

  return app;
}
