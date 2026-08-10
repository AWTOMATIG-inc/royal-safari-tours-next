import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-toolkit";
import path from "path";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";
import { DepartmentRoutes } from "./app/modules/department/department.route";
import { DesignationRoutes } from "./app/modules/designation/designation.route";
import { EmploymentTypeRoutes } from "./app/modules/employmentType/employmentType.route";
import { EmploymentStatusRoutes } from "./app/modules/employmentStatus/employmentStatus.route";
import { EmployeeRoutes } from "./app/modules/employee/employee.route";
import { EmployeeDocumentRoutes } from "./app/modules/employeeDocument/employeeDocument.route";
import { HrmDashboardRoutes } from "./app/modules/hrmDashboard/hrmDashboard.route";
import { prisma } from "./app/utils/prisma";
import { requestResponseLogger } from "./app/middlewares/logger";
import { errorHandler } from "./app/middlewares/errorHandler";

const app = express();

// Security HTTP headers
app.use(helmet());

// Response compression
app.use(compression());

// Custom Request/Response Logging Middleware
app.use(requestResponseLogger);

// CORS and body parsers
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (Photos & Documents)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Auth, User, Master & HRM routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/departments", DepartmentRoutes);
app.use("/api/v1/designations", DesignationRoutes);
app.use("/api/v1/employment-types", EmploymentTypeRoutes);
app.use("/api/v1/employment-statuses", EmploymentStatusRoutes);
app.use("/api/v1/employees", EmployeeRoutes);
app.use("/api/v1/employees", EmployeeDocumentRoutes);
app.use("/api/v1/hrm", HrmDashboardRoutes);

// Health check endpoint
app.get("/api/v1/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      status: "UP",
      database: "CONNECTED",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: "DOWN",
      database: "DISCONNECTED",
      error: error.message || "Database connection error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Home route
app.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Royal Safari Tours backend running",
  });
});

// Custom 404 handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Custom Global Error Handler
app.use(errorHandler);

export default app;
