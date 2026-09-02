import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: "A record with this value already exists" },
  P2025: { status: 404, message: "Record not found" },
  P2003: { status: 400, message: "Related record not found" },
  P2014: { status: 409, message: "Required related record is missing" },
};

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = PRISMA_ERROR_MAP[err.code];
    if (prismaError) {
      res.status(prismaError.status).json({
        success: false,
        status: prismaError.status,
        error: prismaError.message,
      });
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      status: 400,
      error: "Invalid data provided",
    });
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`\x1b[31m[API Error] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}\x1b[0m`);
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "********";
    if (safeBody.currentPassword) safeBody.currentPassword = "********";
    if (safeBody.newPassword) safeBody.newPassword = "********";
    console.error(`  \x1b[90m-> Request Body:\x1b[0m`, safeBody);
  }
  console.error(`  \x1b[31m-> Error: ${message}\x1b[0m`);
  if (process.env.NODE_ENV === "development") {
    console.error(`  \x1b[90m-> Stack Trace:\x1b[0m\n`, err.stack || err);
  }
  console.error(`\x1b[90m--------------------------------------------------------------------------------\x1b[0m`);

  res.status(status).json({
    success: false,
    status,
    error: (status >= 500 && process.env.NODE_ENV === "production") ? "Internal Server Error" : message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
