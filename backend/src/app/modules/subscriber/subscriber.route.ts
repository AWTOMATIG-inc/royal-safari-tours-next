import { Router } from "express";
import * as subscriberController from "./subscriber.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

// Public subscription endpoint
router.post("/", subscriberController.createSubscriber);

// Admin-only listing and deletion
router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), subscriberController.getAllSubscribers);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), subscriberController.deleteSubscriber);

export default router;
