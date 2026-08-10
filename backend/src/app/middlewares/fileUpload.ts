import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads/avatars");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
