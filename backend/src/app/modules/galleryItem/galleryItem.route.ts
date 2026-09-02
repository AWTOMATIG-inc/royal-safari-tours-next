import express from "express";
import { uploadGalleryImage } from "../../middlewares/galleryUpload";
import * as galleryController from "./galleryItem.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = express.Router();

// Public & Admin List / Search
router.get("/", galleryController.getAllGalleryItems);

// Single Item Details
router.get("/:id", galleryController.getSingleGalleryItem);

// Create Gallery Item (with image file upload)
router.post(
  "/",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  uploadGalleryImage.single("image"),
  galleryController.createGalleryItem
);

// Update Gallery Item (optional file replacement)
router.patch(
  "/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  uploadGalleryImage.single("image"),
  galleryController.updateGalleryItem
);

// Delete Gallery Item
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), galleryController.deleteGalleryItem);

export const GalleryItemRoutes = router;
