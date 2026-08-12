import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as leaveApplicationService from "./leaveApplication.service";

export const getMyLeaveBalances = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await leaveApplicationService.getMyLeaveBalances(user.id, user.email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave balances retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve leave balances",
    });
  }
};

export const getMyLeaveApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await leaveApplicationService.getMyLeaveApplications(user.id, user.email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Leave applications retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve leave applications",
    });
  }
};

export const applyLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await leaveApplicationService.applyLeave(user.id, user.email, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Leave application submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to submit leave application",
    });
  }
};

export const getAllLeaveApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const filters = {
      status: req.query.status as string,
      departmentId: req.query.departmentId as string,
      search: req.query.search as string,
    };
    const result = await leaveApplicationService.getAllLeaveApplications(user, filters);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "All leave applications retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve leave applications",
    });
  }
};

export const updateLeaveApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    const result = await leaveApplicationService.updateLeaveApplicationStatus(id, user.id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Leave application ${req.body.status.toLowerCase()} successfully`,
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update leave application status",
    });
  }
};

export const updateEmployeeLeaveBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await leaveApplicationService.updateEmployeeLeaveBalance(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee leave balance updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update leave balance",
    });
  }
};
