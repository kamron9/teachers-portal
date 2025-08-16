import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSearchTeachers,
  handleGetSubjects,
  handleGetWalletBalance,
  handleGetWalletEntries,
  handleNotImplemented
} from "./routes/teachers";
import {
  handleLogin,
  handleRegister,
  handleGetCurrentUser,
  handleLogout,
  handleRefreshToken
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/debug", (_req, res) => {
    res.json({
      message: "Debug endpoint working",
      timestamp: new Date().toISOString(),
      baseUrl: "/api"
    });
  });

  app.get("/api/demo", handleDemo);

  // Mock tutoring marketplace API routes
  app.get("/api/search/teachers", handleSearchTeachers);
  app.get("/api/subjects", handleGetSubjects);

  // Wallet endpoints
  app.get("/api/wallet/balance", handleGetWalletBalance);
  app.get("/api/wallet/entries", handleGetWalletEntries);

  // Additional endpoints that might be called
  app.get("/api/teachers/profile", handleNotImplemented);
  app.get("/api/students/profile", handleNotImplemented);
  app.get("/api/teachers/subject-offerings", handleNotImplemented);
  app.get("/api/bookings", handleNotImplemented);
  app.get("/api/payments", handleNotImplemented);
  app.get("/api/notifications", handleNotImplemented);

  return app;
}
