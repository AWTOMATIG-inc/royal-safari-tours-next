import "dotenv/config";
import http from "http";
import app from "./app";
import config from "./app/config";
import { prisma } from "./app/utils/prisma";

let server: http.Server;

async function bootstrap() {
  try {
    // Attempt database connection
    await prisma.$connect();
    console.log("Database connection successful");

    server = app.listen(config.port, () => {
      console.log(`Server listening on port http://localhost:${config.port}`);
    });
  } catch (error: any) {
    console.error("Database connection failed:", error.message || error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`[Process] Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log("[Process] HTTP server closed.");
      try {
        await prisma.$disconnect();
        console.log("[Process] Database connections closed.");
        process.exit(0);
      } catch (err) {
        console.error("[Process] Error during database disconnection:", err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Process] Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Process] Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

bootstrap();
