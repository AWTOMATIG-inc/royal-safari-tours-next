import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as hrmDashboardService from "./hrmDashboard.service";

export const getHrmDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await hrmDashboardService.getHrmDashboardStats();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "HRM dashboard statistics retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve HRM dashboard statistics",
    });
  }
};
