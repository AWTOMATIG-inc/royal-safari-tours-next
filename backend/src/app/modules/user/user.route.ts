import express from "express";
import * as userController from "./user.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/fileUpload";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), userController.getAll);
router.put(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  upload.single("avatar"),
  userController.update
);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), userController.remove);

export const UserRoutes = router;
