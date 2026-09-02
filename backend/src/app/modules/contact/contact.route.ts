import { Router } from "express";
import * as contactController from "./contact.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

// Public contact inquiry submission
router.post("/", contactController.createContact);

// Admin-only management endpoints
router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), contactController.getAllContacts);
router.get("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), contactController.getContactById);
router.patch("/:id/status", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), contactController.updateContactStatus);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), contactController.deleteContact);

export default router;
