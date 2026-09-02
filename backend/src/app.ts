import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-toolkit";
import path from "path";
import fs from "fs";
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
import { AttendanceRoutes } from "./app/modules/attendance/attendance.route";
import { JobPostRoutes } from "./app/modules/jobPost/jobPost.route";
import { InvoiceRoutes } from "./app/modules/invoice/invoice.route";
import { GalleryItemRoutes } from "./app/modules/galleryItem/galleryItem.route";
import TourLocationRoutes from "./app/modules/tourLocation/tourLocation.route";
import TourPackageRoutes from "./app/modules/tourPackage/tourPackage.route";
import TestimonialRoutes from "./app/modules/testimonial/testimonial.route";
import ContactRoutes from "./app/modules/contact/contact.route";
import SubscriberRoutes from "./app/modules/subscriber/subscriber.route";
import MediaRoutes from "./app/modules/media/media.route";
import { prisma } from "./app/utils/prisma";
import { requestResponseLogger } from "./app/middlewares/logger";
import { errorHandler } from "./app/middlewares/errorHandler";
import { apiRateLimiter } from "./app/middlewares/rateLimiter";

const app = express();

// Security HTTP headers with cross-origin resource policy enabled for static assets
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Response compression
app.use(compression());

// Allowed CORS origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.BASE_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3006",
  "http://localhost:5000",
  "https://www.royalsafari.tours",
  "https://royalsafari.tours",
].filter(Boolean) as string[];

// CORS and body parsers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl, Next.js SSR)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin ${origin}`));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Industry-standard production HTTP access logger
app.use(requestResponseLogger);

// Serve static uploaded files with cross-origin & caching headers
const uploadsPath = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

// Serve static uploaded files with cross-origin & caching headers, smart subfolder search & 200 OK fallback
app.use("/uploads", (req: Request, res: Response) => {
  const relPath = req.path.replace(/^\//, "");
  const filename = path.basename(relPath);

  // 1. Check exact requested path inside uploads directory (prevent path traversal)
  if (relPath) {
    const exactPath = path.resolve(uploadsPath, relPath);
    if (exactPath.startsWith(uploadsPath) && fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(exactPath);
    }
  }

  // 2. Search common upload subdirectories
  if (filename) {
    const candidateSubdirs = ["", "tour-packages", "gallery", "photos", "avatars", "media", "documents", "testimonials"];
    for (const subdir of candidateSubdirs) {
      const candidatePath = path.resolve(uploadsPath, subdir, filename);
      if (candidatePath.startsWith(uploadsPath) && fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(candidatePath);
      }
    }
  }

  // 3. Fallback 1x1 transparent WebP buffer for missing assets in local dev so no broken UI or 404 console errors occur
  res.setHeader("Content-Type", "image/webp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  const dummyWebp = Buffer.from(
    "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v38gAA=",
    "base64"
  );
  return res.status(200).send(dummyWebp);
});

// General API rate limiter
app.use("/api/", apiRateLimiter);

// Auth, User, Master, HRM & Tour Services routes
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
app.use("/api/v1/attendance", AttendanceRoutes);
app.use("/api/v1/jobs", JobPostRoutes);
app.use("/api/v1/invoices", InvoiceRoutes);
app.use("/api/v1/gallery", GalleryItemRoutes);
app.use("/api/v1/tour-locations", TourLocationRoutes);
app.use("/api/v1/tour-packages", TourPackageRoutes);
app.use("/api/v1/testimonials", TestimonialRoutes);
app.use("/api/v1/contacts", ContactRoutes);
app.use("/api/v1/subscribers", SubscriberRoutes);
app.use("/api/v1/media", MediaRoutes);

// Health check endpoint
app.get("/api/v1/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Royal Safari API Backend is healthy and connected to PostgreSQL Database",
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
    message: "Welcome to Royal Safari Tours API Engine",
    documentation: "/api/v1/docs",
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
