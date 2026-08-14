import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as leaveTypeService from "./leaveType.service";

export const getAllLeaveTypes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await leaveTypeService.getAllLeaveTypes();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave types retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve leave types",
    });
  }
};

export const getLeaveTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await leaveTypeService.getLeaveTypeById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave type retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Leave type not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve leave type",
    });
  }
};

export const createLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await leaveTypeService.createLeaveType(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Leave type created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create leave type",
    });
  }
};

export const updateLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await leaveTypeService.updateLeaveType(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave type updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Leave type not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update leave type",
    });
  }
};

export const deleteLeaveType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await leaveTypeService.deleteLeaveType(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave type deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Leave type not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to delete leave type",
    });
  }
};
