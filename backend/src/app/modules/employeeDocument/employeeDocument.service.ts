import fs from "fs";
import path from "path";
import { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const uploadDocument = async (
  user: any,
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

  // RBAC Ownership Check for EMPLOYEE role
  if (
    user.role === Role.EMPLOYEE &&
    employee.userId !== user.id &&
    employee.email !== user.email
  ) {
    throw new Error("Forbidden: You can only upload documents to your own employee profile");
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
  user: any,
  docId: string,
  data: { documentName?: string },
  newFileUrl?: string,
  newFileType?: string
) => {
  const existing = await prisma.employeeDocument.findUnique({
    where: { id: docId },
    include: { employee: true },
  });

  if (!existing) {
    throw new Error("Employee document not found");
  }

  // RBAC Ownership Check for EMPLOYEE role
  if (
    user.role === Role.EMPLOYEE &&
    existing.employee.userId !== user.id &&
    existing.employee.email !== user.email
  ) {
    throw new Error("Forbidden: You can only update documents on your own employee profile");
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

export const deleteDocument = async (user: any, docId: string) => {
  const document = await prisma.employeeDocument.findUnique({
    where: { id: docId },
    include: { employee: true },
  });

  if (!document) {
    throw new Error("Employee document not found");
  }

  // RBAC Ownership Check for EMPLOYEE role
  if (
    user.role === Role.EMPLOYEE &&
    document.employee.userId !== user.id &&
    document.employee.email !== user.email
  ) {
    throw new Error("Forbidden: You can only delete documents from your own employee profile");
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
