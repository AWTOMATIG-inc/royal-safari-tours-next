import fs from "fs";
import path from "path";
import { prisma } from "../../utils/prisma";

export const uploadDocument = async (
  employeeId: string,
  documentName: string,
  fileUrl: string,
  fileType?: string
) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const document = await prisma.employeeDocument.create({
    data: {
      employeeId,
      documentName: documentName || "Uploaded Document",
      fileUrl,
      fileType: fileType || null,
    },
  });

  return document;
};

export const deleteDocument = async (docId: string) => {
  const document = await prisma.employeeDocument.findUnique({
    where: { id: docId },
  });

  if (!document) {
    throw new Error("Employee document not found");
  }

  // Attempt to delete file from disk if local path exists
  if (document.fileUrl && document.fileUrl.startsWith("/uploads/documents/")) {
    const relativePath = document.fileUrl.replace("/uploads/", "");
    const absolutePath = path.join(process.cwd(), "uploads", relativePath);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (err) {
        console.error("[Document Delete Error]:", err);
      }
    }
  }

  return await prisma.employeeDocument.delete({
    where: { id: docId },
  });
};
