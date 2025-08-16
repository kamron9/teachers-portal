import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleAuthMe,
  handleLogin,
  handleRegister,
  handleGetTeacherProfile,
  handleUpdateTeacherProfile,
  handleSearchTeachers,
  handleGetBookings,
  handleCreateBooking,
  handleGetAvailability,
  handleCreateAvailabilityRule,
  handleUpdateAvailabilityRule,
  handleDeleteAvailabilityRule,
  handleGetAvailableSlots,
  handleGetSubjectOfferings,
  handleGetReviews,
  handleCreateReview,
  handleGetMessages,
  handleGetNotifications,
  handleHealthCheck
} from "./routes/tutoring";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Health check
  app.get("/health", handleHealthCheck);
  app.get("/api/v1/health", handleHealthCheck);

  // Auth routes
  app.get("/api/v1/auth/me", handleAuthMe);
  app.post("/api/v1/auth/login", handleLogin);
  app.post("/api/v1/auth/register", handleRegister);

  // Teacher routes
  app.get("/api/v1/teachers", handleSearchTeachers);

  // Booking routes
  app.get("/api/v1/bookings", handleGetBookings);
  app.post("/api/v1/bookings", handleCreateBooking);

  // Basic availability routes
  app.post("/api/v1/availability", handleCreateAvailabilityRule);

  // Subject offerings routes
  app.get("/api/v1/subjects/offerings", handleGetSubjectOfferings);

  // Review routes
  app.get("/api/v1/reviews", handleGetReviews);
  app.post("/api/v1/reviews", handleCreateReview);

  // Message routes
  app.get("/api/v1/messages", handleGetMessages);

  // Notification routes
  app.get("/api/v1/notifications", handleGetNotifications);

  // Generic 404 handler for API routes
  app.use("/api/v1/*", (req, res) => {
    res.status(404).json({
      error: "NotFound",
      message: `API endpoint ${req.originalUrl} not found`
    });
  });

  return app;
}
