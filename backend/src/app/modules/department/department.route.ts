import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as departmentController from "./department.controller";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation";

const router = express.Router();

// GET all departments
router.get("/", auth(), departmentController.getAllDepartments);

// GET department by ID
router.get("/:id", auth(), departmentController.getDepartmentById);

// POST create department (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(createDepartmentSchema),
  departmentController.createDepartment
);

// PATCH update department (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(updateDepartmentSchema),
  departmentController.updateDepartment
);

// DELETE department (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  departmentController.deleteDepartment
);

export const DepartmentRoutes = router;
