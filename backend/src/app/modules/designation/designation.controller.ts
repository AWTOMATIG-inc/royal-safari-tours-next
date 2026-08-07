import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as designationService from "./designation.service";

export const createDesignation = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await designationService.createDesignation(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Designation created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create designation",
    });
  }
};

export const getAllDesignations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await designationService.getAllDesignations();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Designations retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve designations",
    });
  }
};

export const getDesignationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await designationService.getDesignationById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Designation retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Designation not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve designation",
    });
  }
};

export const updateDesignation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await designationService.updateDesignation(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Designation updated successfully",
      data: result,
    });
  } catch (error: any) {
    const status = error.message.includes("not found")
      ? StatusCodes.NOT_FOUND
      : error.message.includes("already exists")
      ? StatusCodes.CONFLICT
      : StatusCodes.BAD_REQUEST;

    res.status(status).json({
      success: false,
      error: error.message || "Failed to update designation",
    });
  }
};

export const deleteDesignation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await designationService.deleteDesignation(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Designation deleted successfully",
      data: result,
    });
  } catch (error: any) {
    const status = error.message.includes("assigned to it")
      ? StatusCodes.CONFLICT
      : error.message.includes("not found")
      ? StatusCodes.NOT_FOUND
      : StatusCodes.BAD_REQUEST;

    res.status(status).json({
      success: false,
      error: error.message || "Failed to delete designation",
    });
  }
};
