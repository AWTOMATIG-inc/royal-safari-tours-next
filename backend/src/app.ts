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
function findFileRecursive(dir: string, targetFilename: string, currentDepth: number = 0): string | null {
  if (currentDepth > 5 || !fs.existsSync(dir)) return null;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.toLowerCase() === targetFilename.toLowerCase()) {
        return full;
      }
      if (entry.isDirectory()) {
        const found = findFileRecursive(full, targetFilename, currentDepth + 1);
        if (found) return found;
      }
    }
  } catch (_e) {}
  return null;
}

app.use("/uploads", (req: Request, res: Response) => {
  let relPath = req.path.replace(/^\//, "");
  try {
    relPath = decodeURIComponent(relPath);
    if (relPath.includes("%")) {
      relPath = decodeURIComponent(relPath);
    }
  } catch (_err) {
    // If decoding fails, keep raw relPath
  }
  const filename = path.basename(relPath);
  const normUploadsPath = uploadsPath.toLowerCase();

  // 1. Check exact requested path inside uploads directory
  if (relPath) {
    const exactPath = path.resolve(uploadsPath, relPath);
    if (exactPath.toLowerCase().startsWith(normUploadsPath) && fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(exactPath);
    }

    // Also check if prefixed under "media/"
    const mediaPath = path.resolve(uploadsPath, "media", relPath);
    if (mediaPath.toLowerCase().startsWith(normUploadsPath) && fs.existsSync(mediaPath) && fs.statSync(mediaPath).isFile()) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(mediaPath);
    }
  }

  // 2. Search common upload subdirectories or find recursively
  if (filename) {
    const candidateSubdirs = ["", "media", "tour-packages", "gallery", "photos", "avatars", "documents", "testimonials"];
    for (const subdir of candidateSubdirs) {
      const candidatePath = path.resolve(uploadsPath, subdir, filename);
      if (candidatePath.toLowerCase().startsWith(normUploadsPath) && fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(candidatePath);
      }
    }

    const recursiveMatch = findFileRecursive(uploadsPath, filename);
    if (recursiveMatch && recursiveMatch.toLowerCase().startsWith(normUploadsPath) && fs.existsSync(recursiveMatch)) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(recursiveMatch);
    }
  }

  // 3. Fallback 1x1 transparent WebP buffer for missing assets in local dev so no broken UI or 404 console errors occur
  res.setHeader("Content-Type", "image/webp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
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
