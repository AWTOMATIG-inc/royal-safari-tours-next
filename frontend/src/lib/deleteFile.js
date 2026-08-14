import fs from "fs";
import path from "path";
export const deleteFile = (folder, filename) => {
  const filePath = path.join(process.cwd(), "uploads", folder, filename);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  fs.unlinkSync(filePath);
  return true;
};
