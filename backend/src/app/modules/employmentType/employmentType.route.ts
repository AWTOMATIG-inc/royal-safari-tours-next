import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as employmentTypeController from "./employmentType.controller";
import { createEmploymentTypeSchema, updateEmploymentTypeSchema } from "./employmentType.validation";

const router = express.Router();

// GET all employment types
router.get("/", auth(), employmentTypeController.getAllEmploymentTypes);

// GET employment type by ID
router.get("/:id", auth(), employmentTypeController.getEmploymentTypeById);

// POST create employment type (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(createEmploymentTypeSchema),
  employmentTypeController.createEmploymentType
);

// PATCH update employment type (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(updateEmploymentTypeSchema),
  employmentTypeController.updateEmploymentType
);

// DELETE employment type (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  employmentTypeController.deleteEmploymentType
);

export const EmploymentTypeRoutes = router;
