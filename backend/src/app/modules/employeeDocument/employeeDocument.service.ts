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

export const getAllDocuments = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const documents = await prisma.employeeDocument.findMany({
    where: { employeeId },
    orderBy: { uploadedAt: "desc" },
  });

  return documents;
};

export const getDocumentById = async (docId: string) => {
  const document = await prisma.employeeDocument.findUnique({
    where: { id: docId },
    include: {
      employee: {
        select: {
          id: true,
          employeeId: true,
          name: true,
        },
      },
    },
  });

  if (!document) {
    throw new Error("Employee document not found");
  }

  return document;
};

export const updateDocument = async (
  docId: string,
  data: { documentName?: string },
  newFileUrl?: string,
  newFileType?: string
) => {
  const existing = await prisma.employeeDocument.findUnique({
    where: { id: docId },
  });

  if (!existing) {
    throw new Error("Employee document not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.documentName !== undefined) {
    updateData.documentName = data.documentName;
  }

  if (newFileUrl) {
    updateData.fileUrl = newFileUrl;
    updateData.fileType = newFileType || null;

    if (existing.fileUrl && existing.fileUrl.startsWith("/uploads/documents/")) {
      const relativePath = existing.fileUrl.replace("/uploads/", "");
      const absolutePath = path.join(process.cwd(), "uploads", relativePath);
      if (fs.existsSync(absolutePath)) {
        try {
          fs.unlinkSync(absolutePath);
        } catch {
          // Old file cleanup is best-effort
        }
      }
    }
  }

  const updated = await prisma.employeeDocument.update({
    where: { id: docId },
    data: updateData,
  });

  return updated;
};

export const deleteDocument = async (docId: string) => {
  const document = await prisma.employeeDocument.findUnique({
    where: { id: docId },
  });

  if (!document) {
    throw new Error("Employee document not found");
  }

  if (document.fileUrl && document.fileUrl.startsWith("/uploads/documents/")) {
    const relativePath = document.fileUrl.replace("/uploads/", "");
    const absolutePath = path.join(process.cwd(), "uploads", relativePath);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch {
        // File cleanup is best-effort
      }
    }
  }

  return await prisma.employeeDocument.delete({
    where: { id: docId },
  });
};
