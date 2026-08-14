import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadDocumentFile } from "../../middlewares/hrmUpload";
import * as documentController from "./employeeDocument.controller";
import { uploadDocumentSchema, updateDocumentSchema } from "./employeeDocument.validation";

const router = express.Router();

// GET single document by docId
router.get(
  "/documents/:docId",
  auth(),
  documentController.getDocumentById
);

// GET all documents for an employee
router.get(
  "/:id/documents",
  auth(),
  documentController.getAllDocuments
);

// POST upload document for an employee (Super Admin, Admin, HR Manager, Employee for own profile)
router.post(
  "/:id/documents",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  uploadDocumentFile.single("file"),
  validateRequest(uploadDocumentSchema),
  documentController.uploadDocument
);

// PATCH update document (name or replace file)
router.patch(
  "/documents/:docId",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  uploadDocumentFile.single("file"),
  validateRequest(updateDocumentSchema),
  documentController.updateDocument
);

// DELETE employee document
router.delete(
  "/documents/:docId",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  documentController.deleteDocument
);

export const EmployeeDocumentRoutes = router;
