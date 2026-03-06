// app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // 필요시 켜세요
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;