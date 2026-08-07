import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as documentService from "./employeeDocument.service";

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = (req.params.id || req.body.employeeId) as string;
    if (!employeeId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "Employee ID is required" });
      return;
    }

    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "Document file is required" });
      return;
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    const documentName = req.body.documentName || req.file.originalname;
    const fileType = req.file.mimetype;

    const result = await documentService.uploadDocument(
      employeeId,
      documentName,
      fileUrl,
      fileType
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Employee document uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Employee not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to upload document",
    });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const docId = req.params.docId as string;
    const result = await documentService.deleteDocument(docId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee document deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("not found") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to delete document",
    });
  }
};
