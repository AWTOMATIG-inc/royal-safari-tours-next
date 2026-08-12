import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as leaveTypeController from "./leaveType.controller";
import * as leaveTypeValidation from "./leaveType.validation";

const router = express.Router();

// GET /api/v1/leave-types (All authenticated roles can view leave policy types)
router.get(
  "/",
  auth(),
  leaveTypeController.getAllLeaveTypes
);

// GET /api/v1/leave-types/:id
router.get(
  "/:id",
  auth(),
  leaveTypeController.getLeaveTypeById
);

// POST /api/v1/leave-types (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(leaveTypeValidation.createLeaveTypeSchema),
  leaveTypeController.createLeaveType
);

// PATCH /api/v1/leave-types/:id (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(leaveTypeValidation.updateLeaveTypeSchema),
  leaveTypeController.updateLeaveType
);

// DELETE /api/v1/leave-types/:id (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  leaveTypeController.deleteLeaveType
);

export const LeaveTypeRoutes = router;
