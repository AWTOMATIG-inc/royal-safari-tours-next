import { Jimp } from "jimp";
import path from "path";
import fs from "fs";

export interface OptimizedImageResult {
  filename: string;
  thumbFilename?: string | null;
  url: string;
  thumbUrl?: string | null;
  size: number;
  width: number | null;
  height: number | null;
  mimeType: string;
}

/**
 * Image Processing & Optimization Pipeline using Jimp (Pure JavaScript)
 * - Zero native C++ / libvips compilation dependencies (100% portable on Ubuntu/Linux VPS)
 * - Auto-resizes large display images to max 1920px width/height while preserving aspect ratio
 * - Writes clean, optimized images to disk with collision-proof naming
 */
export async function optimizeAndSaveImage(
  buffer: Buffer,
  categorySubfolder: string = "media",
  originalFilename?: string
): Promise<OptimizedImageResult> {
  // Determine absolute target uploads directory
  const baseUploadsDir = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.join(process.cwd(), "uploads");

  // Normalize and sanitize subfolder path (strip directory traversal sequences)
  const sanitizedSubfolder = categorySubfolder
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")
    .replace(/^\/+|\/+$/g, "");
  const targetDir = path.resolve(baseUploadsDir, sanitizedSubfolder);

  // Assert targetDir is strictly within baseUploadsDir
  if (!targetDir.toLowerCase().startsWith(baseUploadsDir.toLowerCase())) {
    throw new Error("Invalid destination folder: Path traversal detected");
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Parse filename and extension
  const parsed = path.parse(originalFilename || "image.jpg");
  const ext = (parsed.ext || ".jpg").toLowerCase();
  const cleanName = parsed.name
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .replace(/\s+/g, "_") || "image";

  let filename = `${cleanName}${ext}`;

  // Collision handling: if file exists, append sequential counter (_1, _2, etc.)
  if (fs.existsSync(path.join(targetDir, filename))) {
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, `${cleanName}_${counter}${ext}`))) {
      counter++;
    }
    filename = `${cleanName}_${counter}${ext}`;
  }

  const mainFilePath = path.join(targetDir, filename);

  let width: number | null = null;
  let height: number | null = null;
  let mimeType = "image/jpeg";
  if (ext === ".png") mimeType = "image/png";
  else if (ext === ".webp") mimeType = "image/webp";
  else if (ext === ".gif") mimeType = "image/gif";
  else if (ext === ".svg") mimeType = "image/svg+xml";

  try {
    // Read image using Jimp
    const image = await Jimp.read(buffer);
    width = image.bitmap.width;
    height = image.bitmap.height;

    // Resize to max 1920x1920 if larger, preserving aspect ratio
    if (width > 1920 || height > 1920) {
      image.scaleToFit({ w: 1920, h: 1920 });
      width = image.bitmap.width;
      height = image.bitmap.height;
    }

    // Write optimized image to destination
    await image.write(mainFilePath as `${string}.${string}`);
  } catch {
    // Fallback to direct buffer write if Jimp encounters an unsupported raw format
    await fs.promises.writeFile(mainFilePath, buffer);
  }

  const mainStats = await fs.promises.stat(mainFilePath);
  const url = `/uploads/${sanitizedSubfolder}/${filename}`;

  return {
    filename,
    thumbFilename: null,
    url,
    thumbUrl: null,
    size: mainStats.size,
    width,
    height,
    mimeType,
  };
}

/**
 * Save generic document files (such as PDF) without image processing
 */
export async function saveGenericFile(
  buffer: Buffer,
  categorySubfolder: string = "media",
  originalFilename?: string,
  mimeType: string = "application/pdf"
): Promise<OptimizedImageResult> {
  const baseUploadsDir = process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.join(process.cwd(), "uploads");

  const sanitizedSubfolder = categorySubfolder
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")
    .replace(/^\/+|\/+$/g, "");
  const targetDir = path.resolve(baseUploadsDir, sanitizedSubfolder);

  if (!targetDir.toLowerCase().startsWith(baseUploadsDir.toLowerCase())) {
    throw new Error("Invalid destination folder: Path traversal detected");
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const parsed = path.parse(originalFilename || "document.pdf");
  const ext = parsed.ext || (mimeType === "application/pdf" ? ".pdf" : "");
  const cleanName = parsed.name
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .replace(/\s+/g, "_") || "document";

  let filename = `${cleanName}${ext}`;
  if (fs.existsSync(path.join(targetDir, filename))) {
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, `${cleanName}_${counter}${ext}`))) {
      counter++;
    }
    filename = `${cleanName}_${counter}${ext}`;
  }

  const filePath = path.join(targetDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  const stats = await fs.promises.stat(filePath);
  const url = `/uploads/${sanitizedSubfolder}/${filename}`;

  return {
    filename,
    thumbFilename: null,
    url,
    thumbUrl: null,
    size: stats.size,
    width: null,
    height: null,
    mimeType,
  };
}
