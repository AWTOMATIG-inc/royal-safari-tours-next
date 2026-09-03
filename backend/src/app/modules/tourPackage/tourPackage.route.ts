import { Router } from "express";
import * as packageController from "./tourPackage.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", packageController.getAllPackages);
router.get("/:slugOrId", packageController.getPackageBySlugOrId);
router.post("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), packageController.createPackage);
router.put("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), packageController.updatePackage);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), packageController.deletePackage);

export default router;
