import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { optimizeAndSaveImage, saveGenericFile, OptimizedImageResult } from "../utils/imageOptimizer";

// Configure Multer to keep upload files in Memory Buffer
const memoryStorage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export const multerUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Allowed: JPEG, PNG, WebP, GIF, PDF"));
    }
  },
});

/**
 * Express Middleware to handle single or multiple uploads (Images via Sharp, PDFs saved directly)
 */
export async function processUploadedImages(
  req: Request & { optimizedFiles?: OptimizedImageResult[] },
  _res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    const fileList: Express.Multer.File[] = [];

    if (Array.isArray(files)) {
      fileList.push(...files);
    } else if (req.file) {
      fileList.push(req.file);
    } else if (files && typeof files === "object") {
      Object.values(files).forEach((arr) => fileList.push(...arr));
    }

    if (fileList.length === 0) {
      return next();
    }

    const folderPath = (req.body?.folderPath || req.query?.folderPath || "") as string;
    const baseSubfolder = (req.body?.subfolder || req.query?.subfolder || "media") as string;
    const categorySubfolder = folderPath
      ? `${baseSubfolder}/${folderPath}`.replace(/\/+/g, "/")
      : baseSubfolder;

    const results: OptimizedImageResult[] = [];

    for (const file of fileList) {
      if (file.mimetype.startsWith("image/")) {
        const optimized = await optimizeAndSaveImage(file.buffer, categorySubfolder, file.originalname);
        results.push(optimized);
      } else {
        const saved = await saveGenericFile(file.buffer, categorySubfolder, file.originalname, file.mimetype);
        results.push(saved);
      }
    }

    req.optimizedFiles = results;
    next();
  } catch (err) {
    next(err);
  }
}
