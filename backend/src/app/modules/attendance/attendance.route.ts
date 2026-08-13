import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as attendanceController from "./attendance.controller";
import * as attendanceValidation from "./attendance.validation";

const router = express.Router();

// POST /api/v1/attendance/check-in (Logged-in Employee check-in with GPS)
router.post(
  "/check-in",
  auth(),
  validateRequest(attendanceValidation.checkInSchema),
  attendanceController.checkIn
);

// POST /api/v1/attendance/check-out (Logged-in Employee check-out with GPS)
router.post(
  "/check-out",
  auth(),
  validateRequest(attendanceValidation.checkOutSchema),
  attendanceController.checkOut
);

// GET /api/v1/attendance/status/today (Logged-in Employee today's status)
router.get(
  "/status/today",
  auth(),
  attendanceController.getTodayStatus
);

// GET /api/v1/attendance/my-history (Logged-in Employee personal history)
router.get(
  "/my-history",
  auth(),
  attendanceController.getMyAttendanceHistory
);

// GET /api/v1/attendance/policy (All Authenticated Roles)
router.get(
  "/policy",
  auth(),
  attendanceController.getAttendancePolicy
);

// GET /api/v1/attendance/admin/today (Super Admin, Admin, HR Manager)
router.get(
  "/admin/today",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  attendanceController.getAdminTodayAttendance
);

// GET /api/v1/attendance/admin/report (Super Admin, Admin, HR Manager)
router.get(
  "/admin/report",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  attendanceController.getAdminAttendanceReport
);

// GET /api/v1/attendance/admin/monthly-summary (Super Admin, Admin, HR Manager)
router.get(
  "/admin/monthly-summary",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  attendanceController.getAdminMonthlySummary
);

// GET /api/v1/attendance/admin/employee-monthly-log (Super Admin, Admin, HR Manager)
router.get(
  "/admin/employee-monthly-log",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  attendanceController.getEmployeeMonthlyDetailedLog
);

// PATCH /api/v1/attendance/policy (Super Admin, Admin, HR Manager)
router.patch(
  "/policy",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(attendanceValidation.updateAttendancePolicySchema),
  attendanceController.updateAttendancePolicy
);

export const AttendanceRoutes = router;
