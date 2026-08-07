import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as employmentStatusService from "./employmentStatus.service";

export const createEmploymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await employmentStatusService.createEmploymentStatus(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Employment status created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create employment status",
    });
  }
};

export const getAllEmploymentStatuses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await employmentStatusService.getAllEmploymentStatuses();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment statuses retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve employment statuses",
    });
  }
};

export const getEmploymentStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentStatusService.getEmploymentStatusById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment status retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Employment status not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve employment status",
    });
  }
};

export const updateEmploymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentStatusService.updateEmploymentStatus(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment status updated successfully",
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
      error: error.message || "Failed to update employment status",
    });
  }
};

export const deleteEmploymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employmentStatusService.deleteEmploymentStatus(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employment status deleted successfully",
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
      error: error.message || "Failed to delete employment status",
    });
  }
};
