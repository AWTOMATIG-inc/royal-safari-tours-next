import multer from "multer";
import path from "path";
import fs from "fs";

const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const galleryStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads/gallery");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  },
});

function photoFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED_PHOTO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP images are allowed."));
  }
}

export const uploadGalleryImage = multer({
  storage: galleryStorage,
  fileFilter: photoFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
