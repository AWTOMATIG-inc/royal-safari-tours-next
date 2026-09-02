import { prisma } from "../../utils/prisma";
import { MediaType } from "@prisma/client";
import path from "path";
import fs from "fs";

export const getMediaItems = async (folderPath: string = "") => {
  return await prisma.mediaItem.findMany({
    where: { folderPath },
    orderBy: [
      { type: "desc" }, // FOLDERS first
      { createdAt: "desc" },
    ],
  });
};

export const createMediaFolder = async (folderName: string, parentFolderPath: string = "") => {
  const baseUploadsDir = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.resolve(process.cwd(), "uploads");

  const cleanFolderName = folderName.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim();
  const cleanParentPath = parentFolderPath.replace(/\.\./g, "").replace(/^\/+|\/+$/g, "");
  const relativeFolderPath = cleanParentPath ? `${cleanParentPath}/${cleanFolderName}` : cleanFolderName;
  const physicalFolder = path.resolve(baseUploadsDir, "media", relativeFolderPath);

  if (!physicalFolder.startsWith(baseUploadsDir)) {
    throw new Error("Invalid folder path: Path traversal detected");
  }

  if (!fs.existsSync(physicalFolder)) {
    fs.mkdirSync(physicalFolder, { recursive: true });
  }

  return await prisma.mediaItem.create({
    data: {
      name: cleanFolderName,
      type: MediaType.FOLDER,
      folderPath: cleanParentPath,
    },
  });
};

export const updateMediaItem = async (id: string, name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9_\-\s.]/g, "").trim();
  return await prisma.mediaItem.update({
    where: { id },
    data: { name: cleanName },
  });
};

export const createMediaFileRecords = async (files: any[], folderPath: string = "") => {
  const records = [];
  for (const f of files) {
    const doc = await prisma.mediaItem.create({
      data: {
        name: f.filename || "file",
        type: MediaType.FILE,
        url: f.url,
        folderPath,
        size: f.size || 0,
        mimeType: f.mimeType || "image/webp",
        width: f.width || null,
        height: f.height || null,
      },
    });
    records.push(doc);
  }
  return records;
};

export const deleteMediaItem = async (id: string) => {
  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) return null;

  const baseUploadsDir = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.resolve(process.cwd(), "uploads");

  if (item.type === MediaType.FOLDER) {
    const fullFolderPath = item.folderPath ? `${item.folderPath}/${item.name}` : item.name;

    // Find and delete all children recursively
    const childItems = await prisma.mediaItem.findMany({
      where: {
        OR: [
          { folderPath: fullFolderPath },
          { folderPath: { startsWith: `${fullFolderPath}/` } },
        ],
      },
    });

    for (const child of childItems) {
      if (child.url) {
        const relPath = child.url.replace(/^\/?(api\/)?uploads\//, "");
        const physicalFile = path.resolve(baseUploadsDir, relPath);
        if (physicalFile.startsWith(baseUploadsDir) && fs.existsSync(physicalFile) && fs.statSync(physicalFile).isFile()) {
          try {
            fs.unlinkSync(physicalFile);
          } catch (err) {
            console.error("Error unlinking child media file:", err);
          }
        }
      }
    }

    await prisma.mediaItem.deleteMany({
      where: {
        OR: [
          { folderPath: fullFolderPath },
          { folderPath: { startsWith: `${fullFolderPath}/` } },
        ],
      },
    });

    const physicalDir = path.resolve(baseUploadsDir, "media", fullFolderPath);
    if (physicalDir.startsWith(baseUploadsDir) && fs.existsSync(physicalDir)) {
      try {
        fs.rmSync(physicalDir, { recursive: true, force: true });
      } catch (err) {
        console.error("Error removing media physical directory:", err);
      }
    }
  } else if (item.url) {
    const relPath = item.url.replace(/^\/?(api\/)?uploads\//, "");
    const physicalFile = path.resolve(baseUploadsDir, relPath);
    if (physicalFile.startsWith(baseUploadsDir) && fs.existsSync(physicalFile) && fs.statSync(physicalFile).isFile()) {
      try {
        fs.unlinkSync(physicalFile);
      } catch (err) {
        console.error("Error deleting physical file:", err);
      }
    }
  }

  return await prisma.mediaItem.delete({
    where: { id },
  });
};
