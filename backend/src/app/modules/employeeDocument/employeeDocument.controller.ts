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

export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.params.id as string;
    const result = await documentService.getAllDocuments(employeeId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee documents retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Employee not found" ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve documents",
    });
  }
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const docId = req.params.docId as string;
    const result = await documentService.getDocumentById(docId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Document retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("not found") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve document",
    });
  }
};

export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const docId = req.params.docId as string;

    const newFileUrl = req.file ? `/uploads/documents/${req.file.filename}` : undefined;
    const newFileType = req.file?.mimetype;

    const result = await documentService.updateDocument(
      docId,
      { documentName: req.body.documentName },
      newFileUrl,
      newFileType
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Document updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("not found") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update document",
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
