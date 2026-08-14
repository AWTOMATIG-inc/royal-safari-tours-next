import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const fileuploader = async (file, folder) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filename = uuidv4() + "-" + file.name;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);
  return filename;
};
