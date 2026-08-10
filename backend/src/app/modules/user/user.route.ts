import express from "express";
import * as userController from "./user.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../middlewares/fileUpload";
import { updateUserSchema } from "./user.validation";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), userController.getAll);
router.get("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), userController.getById);
router.put(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  upload.single("avatar"),
  validateRequest(updateUserSchema),
  userController.update
);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), userController.remove);

export const UserRoutes = router;
