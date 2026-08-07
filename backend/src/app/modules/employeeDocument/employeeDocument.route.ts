import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { uploadDocumentFile } from "../../middlewares/hrmUpload";
import * as documentController from "./employeeDocument.controller";

const router = express.Router();

// POST upload document for an employee (Super Admin, Admin, HR Manager)
router.post(
  "/:id/documents",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  uploadDocumentFile.single("file"),
  documentController.uploadDocument
);

// DELETE employee document (Super Admin, Admin, HR Manager)
router.delete(
  "/documents/:docId",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  documentController.deleteDocument
);

export const EmployeeDocumentRoutes = router;
