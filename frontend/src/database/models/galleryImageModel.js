import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
  },
  { timestamps: true },
);

export const GalleryImageModel =
  mongoose.models.GalleryImage ||
  mongoose.model("GalleryImage", galleryImageSchema);
