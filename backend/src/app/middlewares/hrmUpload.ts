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

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const photoStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads/photos");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads/documents");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

function photoFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED_PHOTO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP images are allowed for photos."));
  }
}

function documentFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, JPEG, and PNG files are allowed for documents."));
  }
}

export const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: photoFileFilter,
});

export const uploadDocumentFile = multer({
  storage: documentStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: documentFileFilter,
});
