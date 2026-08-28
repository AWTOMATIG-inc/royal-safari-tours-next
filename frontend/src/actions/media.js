"use server";

import { db_connect } from "@/database";
import { GalleryImageModel } from "@/database/models/galleryImageModel";
import { MediaModel } from "@/database/models/mediaModel";
import { TourPackageModel } from "@/database/models/tourPackageModel";
import { deleteFile } from "@/lib/deleteFile";

export const getMediaByFolderPath = async (folderPath = "") => {
  try {
    await db_connect();

    // 1. Fetch folders and media files for the active folderPath
    const mediaDocs = await MediaModel.find({ folderPath })
      .sort({ type: -1, createdAt: -1 })
      .lean();

    const resultItems = [...mediaDocs];

    // 2. If at Root (folderPath === ""), also include existing MongoDB gallery images & tour package images so no images disappear!
    if (folderPath === "") {
      const existingUrls = new Set(resultItems.map((item) => item.url));

      // Fetch existing GalleryImageModel documents
      const galleryDocs = await GalleryImageModel.find().lean();
      for (const doc of galleryDocs) {
        const url = `/api/uploads/gallery/${doc.filename}`;
        if (!existingUrls.has(url)) {
          existingUrls.add(url);
          resultItems.push({
            _id: doc._id.toString(),
            name: doc.filename,
            type: "file",
            url,
            folderPath: "",
            isExistingGallery: true,
          });
        }
      }

      // Fetch existing TourPackageModel documents
      const tourDocs = await TourPackageModel.find().lean();
      for (const tour of tourDocs) {
        const img = tour.featuredImage || tour.image;
        if (img) {
          const url = img.startsWith("/") || img.startsWith("http")
            ? img
            : `/api/uploads/tour-packages/${img}`;

          if (!existingUrls.has(url)) {
            existingUrls.add(url);
            resultItems.push({
              _id: `pkg-${tour._id}`,
              name: `${tour.title} (Banner)`,
              type: "file",
              url,
              folderPath: "",
              isExistingTour: true,
            });
          }
        }
      }
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(resultItems)),
    };
  } catch (error) {
    console.error("Get Media By Folder Error:", error);
    return { success: false, data: [] };
  }
};

export const createMediaFolder = async (name, parentPath = "") => {
  try {
    const cleanName = name.trim();
    if (!cleanName) return { success: false, message: "Folder name is required" };

    await db_connect();
    const existing = await MediaModel.findOne({
      name: cleanName,
      type: "folder",
      folderPath: parentPath,
    });

    if (existing) {
      return { success: false, message: "Folder with this name already exists" };
    }

    const newFolder = await MediaModel.create({
      name: cleanName,
      type: "folder",
      folderPath: parentPath,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newFolder)),
    };
  } catch (error) {
    console.error("Create Media Folder Error:", error);
    return { success: false, message: "Failed to create folder" };
  }
};

export const deleteMediaItem = async (id) => {
  try {
    await db_connect();

    // Check if it's an existing GalleryImageModel ID
    const galleryItem = await GalleryImageModel.findById(id);
    if (galleryItem) {
      deleteFile("gallery", galleryItem.filename);
      await GalleryImageModel.findByIdAndDelete(id);
      return { success: true, message: "Deleted successfully" };
    }

    const item = await MediaModel.findById(id);
    if (!item) return { success: false, message: "Media item not found" };

    if (item.type === "folder") {
      const childPath = item.folderPath ? `${item.folderPath}/${item.name}` : item.name;
      await MediaModel.deleteMany({
        $or: [{ folderPath: childPath }, { folderPath: new RegExp(`^${childPath}/`) }],
      });
      await MediaModel.findByIdAndDelete(id);
    } else {
      if (item.url && item.url.includes("/uploads/media/")) {
        const filename = item.url.split("/uploads/media/")[1];
        if (filename) deleteFile("media", filename);
      }
      await MediaModel.findByIdAndDelete(id);
    }

    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("Delete Media Item Error:", error);
    return { success: false, message: "Failed to delete item" };
  }
};
