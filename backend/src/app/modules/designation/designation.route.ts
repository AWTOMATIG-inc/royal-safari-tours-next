import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import * as designationController from "./designation.controller";
import { createDesignationSchema, updateDesignationSchema } from "./designation.validation";

const router = express.Router();

// GET all designations
router.get("/", auth(), designationController.getAllDesignations);

// GET designation by ID
router.get("/:id", auth(), designationController.getDesignationById);

// POST create designation (Super Admin, Admin, HR Manager)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(createDesignationSchema),
  designationController.createDesignation
);

// PATCH update designation (Super Admin, Admin, HR Manager)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(updateDesignationSchema),
  designationController.updateDesignation
);

// DELETE designation (Super Admin, Admin)
router.delete(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  designationController.deleteDesignation
);

export const DesignationRoutes = router;
