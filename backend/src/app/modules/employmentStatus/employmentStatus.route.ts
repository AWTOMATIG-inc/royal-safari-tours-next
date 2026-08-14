import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as employmentStatusController from "./employmentStatus.controller";
import { createEmploymentStatusSchema, updateEmploymentStatusSchema } from "./employmentStatus.validation";

const router = express.Router();

// GET all employment statuses
router.get("/", auth(), employmentStatusController.getAllEmploymentStatuses);

// GET employment status by ID
router.get("/:id", auth(), employmentStatusController.getEmploymentStatusById);

// POST create employment status (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(createEmploymentStatusSchema),
  employmentStatusController.createEmploymentStatus
);

// PATCH update employment status (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(updateEmploymentStatusSchema),
  employmentStatusController.updateEmploymentStatus
);

// DELETE employment status (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  employmentStatusController.deleteEmploymentStatus
);

export const EmploymentStatusRoutes = router;
