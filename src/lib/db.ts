import { PrismaClient } from "@prisma/client";

// Declare global variable to prevent multiple instances during hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

// Configure Prisma client with logs in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? [
          {
            emit: "event",
            level: "query",
          },
          {
            emit: "stdout",
            level: "error",
          },
          {
            emit: "stdout",
            level: "info",
          },
          {
            emit: "stdout",
            level: "warn",
          },
        ]
      : [],
  });
};

// Create the prisma client singleton
export const prisma = global.prisma || prismaClientSingleton();

// In development environment, attach prisma to the global object
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

// For production environments, add a shutdown handler
if (process.env.NODE_ENV === "production") {
  // Handle cleanup on app termination
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
