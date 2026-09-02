import sharp from "sharp";
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
 * High-Performance Image Optimization Pipeline using Sharp
 * - Saves a single clean, high-performance WebP image matching the uploaded image name
 * - Strips redundant duplicate thumbnail creation to save disk space
 * - Auto-orients EXIF metadata
 * - Resizes main display image (max 1920px width/height, 84% quality WebP)
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

  // Generate clean filename matching uploaded image name
  const rawBaseName = path.parse(originalFilename || "image").name;
  const cleanName = rawBaseName
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .replace(/\s+/g, "_") || "image";

  let filename = `${cleanName}.webp`;

  // Collision handling: if file exists, append sequential counter (_1, _2, etc.)
  if (fs.existsSync(path.join(targetDir, filename))) {
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, `${cleanName}_${counter}.webp`))) {
      counter++;
    }
    filename = `${cleanName}_${counter}.webp`;
  }

  const mainFilePath = path.join(targetDir, filename);

  // Process & Optimize Single WebP Image
  const sharpInstance = sharp(buffer).rotate(); // Auto-rotate EXIF
  const metadata = await sharpInstance.metadata();

  const mainWebpBuffer = await sharpInstance
    .resize({
      width: 1920,
      height: 1920,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();

  await fs.promises.writeFile(mainFilePath, mainWebpBuffer);

  const mainStats = await fs.promises.stat(mainFilePath);
  const url = `/uploads/${sanitizedSubfolder}/${filename}`;

  return {
    filename,
    thumbFilename: null,
    url,
    thumbUrl: null,
    size: mainStats.size,
    width: metadata.width || null,
    height: metadata.height || null,
    mimeType: "image/webp",
  };
}
