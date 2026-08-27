import { prisma } from "../../utils/prisma";
import fs from "fs";
import path from "path";

export const createGalleryItem = async (payload: {
  title: string;
  caption?: string;
  destination?: string;
  packageId?: string;
  imageUrl: string;
}) => {
  const result = await prisma.galleryItem.create({
    data: {
      title: payload.title,
      caption: payload.caption || null,
      destination: payload.destination || null,
      packageId: payload.packageId || null,
      imageUrl: payload.imageUrl,
      isPublished: true,
    },
  });

  return result;
};

export const getAllGalleryItems = async (query: {
  destination?: string;
  search?: string;
}) => {
  const where: any = {};

  if (query.destination && query.destination !== "All") {
    where.destination = {
      contains: query.destination,
      mode: "insensitive",
    };
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { caption: { contains: query.search, mode: "insensitive" } },
      { destination: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const result = await prisma.galleryItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const getSingleGalleryItem = async (id: string) => {
  const result = await prisma.galleryItem.findUnique({
    where: { id },
  });
  return result;
};

export const updateGalleryItem = async (
  id: string,
  payload: {
    title?: string;
    caption?: string;
    destination?: string;
    packageId?: string;
    imageUrl?: string;
  }
) => {
  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Gallery item not found");
  }

  const dataToUpdate: any = {};
  if (payload.title !== undefined) dataToUpdate.title = payload.title;
  if (payload.caption !== undefined) dataToUpdate.caption = payload.caption;
  if (payload.destination !== undefined) dataToUpdate.destination = payload.destination;
  if (payload.packageId !== undefined) dataToUpdate.packageId = payload.packageId;

  if (payload.imageUrl) {
    dataToUpdate.imageUrl = payload.imageUrl;
    if (existing.imageUrl && existing.imageUrl.startsWith("/uploads/gallery/")) {
      const oldFilePath = path.join(process.cwd(), existing.imageUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
  }

  const result = await prisma.galleryItem.update({
    where: { id },
    data: dataToUpdate,
  });

  return result;
};

export const deleteGalleryItem = async (id: string) => {
  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Gallery item not found");
  }

  if (existing.imageUrl && existing.imageUrl.startsWith("/uploads/gallery/")) {
    const filePath = path.join(process.cwd(), existing.imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Error unlinking gallery file:", err);
      }
    }
  }

  const result = await prisma.galleryItem.delete({
    where: { id },
  });

  return result;
};
