import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export { prisma };
export default prisma;
