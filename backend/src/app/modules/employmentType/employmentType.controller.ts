import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as employmentTypeService from "./employmentType.service";

export const createEmploymentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await employmentTypeService.createEmploymentType(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Employment type created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create employment type",
    });
  }
};

export const getAllEmploymentTypes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await employmentTypeService.getAllEmploymentTypes();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment types retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve employment types",
    });
  }
};

export const getEmploymentTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentTypeService.getEmploymentTypeById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment type retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Employment type not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve employment type",
    });
  }
};

export const updateEmploymentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentTypeService.updateEmploymentType(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment type updated successfully",
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
      error: error.message || "Failed to update employment type",
    });
  }
};

export const deleteEmploymentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentTypeService.deleteEmploymentType(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment type deleted successfully",
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
      error: error.message || "Failed to delete employment type",
    });
  }
};
