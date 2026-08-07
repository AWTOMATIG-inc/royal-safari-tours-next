"use server";
import { db_connect } from "@/database";
import { GalleryImageModel } from "@/database/models/galleryImageModel";

export const getGalleryImages = async () => {
  try {
    await db_connect();
    const data = await GalleryImageModel.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("Get Gallery Images Error:", error);
    return { success: false, message: "Failed to fetch gallery images" };
  }
};
