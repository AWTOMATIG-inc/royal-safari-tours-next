import express from "express";
import { uploadGalleryImage } from "../../middlewares/galleryUpload";
import * as galleryController from "./galleryItem.controller";

const router = express.Router();

// Public & Admin List / Search
router.get("/", galleryController.getAllGalleryItems);

// Single Item Details
router.get("/:id", galleryController.getSingleGalleryItem);

// Create Gallery Item (with image file upload)
router.post("/", uploadGalleryImage.single("image"), galleryController.createGalleryItem);

// Update Gallery Item (optional file replacement)
router.patch("/:id", uploadGalleryImage.single("image"), galleryController.updateGalleryItem);

// Delete Gallery Item
router.delete("/:id", galleryController.deleteGalleryItem);

export const GalleryItemRoutes = router;
