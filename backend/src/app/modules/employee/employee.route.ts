import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadPhoto } from "../../middlewares/hrmUpload";
import * as employeeController from "./employee.controller";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation";

const router = express.Router();

// GET employee self-profile (All Authenticated Employees/Users)
router.get("/me", auth(), employeeController.getEmployeeSelfProfile);

// PATCH update employee self-profile (Phone number & Profile photo)
router.patch(
  "/me",
  auth(),
  uploadPhoto.single("photo"),
  employeeController.updateEmployeeSelfProfile
);

// GET all employees with search, filter, pagination (Authenticated)
router.get("/", auth(), employeeController.getAllEmployees);

// GET employee by ID (Authenticated)
router.get("/:id", auth(), employeeController.getEmployeeById);

// POST create employee (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  uploadPhoto.single("photo"),
  validateRequest(createEmployeeSchema),
  employeeController.createEmployee
);

// PATCH update employee (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  uploadPhoto.single("photo"),
  validateRequest(updateEmployeeSchema),
  employeeController.updateEmployee
);

// DELETE employee (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  employeeController.deleteEmployee
);

export const EmployeeRoutes = router;
