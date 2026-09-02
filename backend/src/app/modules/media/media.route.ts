import { Router } from "express";
import * as mediaController from "./media.controller";
import { multerUpload, processUploadedImages } from "../../middlewares/mediaUpload";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), mediaController.getMediaItems);
router.post("/folder", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), mediaController.createFolder);
router.patch("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), mediaController.updateMediaItem);
router.post(
  "/upload",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.array("images", 10),
  processUploadedImages,
  mediaController.uploadMedia
);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), mediaController.deleteMediaItem);

export default router;
