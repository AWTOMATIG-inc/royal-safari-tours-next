import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["folder", "file"],
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
    folderPath: {
      type: String,
      default: "", // "" means Root, "Tours" means inside Tours, "Tours/Coral Island" means nested
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

delete mongoose.models.Media;

export const MediaModel =
  mongoose.models.Media || mongoose.model("Media", mediaSchema);
