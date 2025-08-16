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

  return app;
}
