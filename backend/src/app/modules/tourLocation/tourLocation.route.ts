import { Router } from "express";
import * as locationController from "./tourLocation.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", locationController.getAllLocations);
router.get("/:idOrSlug", locationController.getLocationByIdOrSlug);
router.post("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), locationController.createLocation);
router.put("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), locationController.updateLocation);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), locationController.deleteLocation);

export default router;
