import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as leaveApplicationController from "./leaveApplication.controller";
import * as leaveApplicationValidation from "./leaveApplication.validation";

const router = express.Router();

// GET /api/v1/leaves/balances/me (Logged-in employee views personal leave balance)
router.get(
  "/balances/me",
  auth(),
  leaveApplicationController.getMyLeaveBalances
);

// GET /api/v1/leaves/my-applications (Logged-in employee views personal leave history)
router.get(
  "/my-applications",
  auth(),
  leaveApplicationController.getMyLeaveApplications
);

// POST /api/v1/leaves/apply (Logged-in employee submits leave request)
router.post(
  "/apply",
  auth(),
  validateRequest(leaveApplicationValidation.applyLeaveSchema),
  leaveApplicationController.applyLeave
);

// GET /api/v1/leaves/applications (All Authenticated Roles - Employees see own applications, Admins see all)
router.get(
  "/applications",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  leaveApplicationController.getAllLeaveApplications
);

// PATCH /api/v1/leaves/applications/:id/status (Super Admin, Admin, HR Manager)
router.patch(
  "/applications/:id/status",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(leaveApplicationValidation.updateLeaveStatusSchema),
  leaveApplicationController.updateLeaveApplicationStatus
);

// PATCH /api/v1/leaves/balances/:id (Super Admin, Admin, HR Manager)
router.patch(
  "/balances/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(leaveApplicationValidation.updateLeaveBalanceSchema),
  leaveApplicationController.updateEmployeeLeaveBalance
);

export const LeaveApplicationRoutes = router;
