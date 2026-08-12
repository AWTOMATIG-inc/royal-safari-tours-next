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
import { LeaveTypeRoutes } from "./app/modules/leaveType/leaveType.route";
import { LeaveApplicationRoutes } from "./app/modules/leaveApplication/leaveApplication.route";
import { prisma } from "./app/utils/prisma";
import { requestResponseLogger } from "./app/middlewares/logger";
import { errorHandler } from "./app/middlewares/errorHandler";

const app = express();

// Security HTTP headers with cross-origin resource policy enabled for static assets
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

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

// Serve static uploaded files (Photos & Documents) with cross-origin headers
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

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
app.use("/api/v1/leave-types", LeaveTypeRoutes);
app.use("/api/v1/leaves", LeaveApplicationRoutes);

// Health check endpoint
app.get("/api/v1/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      message: "HRM API Backend is healthy and connected to Supabase Database",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Welcome to Royal Safari Tours HRM Backend API",
  });
});

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
