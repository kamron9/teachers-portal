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

  // Mock tutoring marketplace API routes
  app.get("/api/search/teachers", handleSearchTeachers);
  app.get("/api/subjects", handleGetSubjects);

  // Wallet endpoints
  app.get("/api/wallet/balance", handleGetWalletBalance);
  app.get("/api/wallet/entries", handleGetWalletEntries);

  // Catch-all for unimplemented API routes - return mock "not implemented" response
  app.use("/api*", handleNotImplemented);

  return app;
}
