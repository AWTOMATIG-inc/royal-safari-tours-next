import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as attendanceService from "./attendance.service";

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const result = await attendanceService.checkIn(user.id, user.email, req.body, ipAddress);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: result.isLate ? "Checked in (Marked Late)" : "Checked in successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to check in",
    });
  }
};

export const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await attendanceService.checkOut(user.id, user.email, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Checked out successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to check out",
    });
  }
};

export const getTodayStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await attendanceService.getTodayStatus(user.id, user.email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Today's attendance status retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve today status",
    });
  }
};

export const getMyAttendanceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const month = req.query.month !== undefined ? Number(req.query.month) : undefined;
    const year = req.query.year !== undefined ? Number(req.query.year) : undefined;
    const result = await attendanceService.getMyAttendanceHistory(user.id, user.email, month, year);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attendance history retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve attendance history",
    });
  }
};

export const getAdminTodayAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const dateStr = req.query.date as string;
    const result = await attendanceService.getAdminTodayAttendance(dateStr);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Daily attendance summary retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve daily attendance summary",
    });
  }
};

export const getAdminAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      departmentId: req.query.departmentId as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };
    const result = await attendanceService.getAdminAttendanceReport(filters);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attendance report retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve attendance report",
    });
  }
};

export const getAdminMonthlySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const month = req.query.month !== undefined ? Number(req.query.month) : undefined;
    const year = req.query.year !== undefined ? Number(req.query.year) : undefined;
    const departmentId = req.query.departmentId as string;
    const search = req.query.search as string;

    const result = await attendanceService.getAdminMonthlySummary(month, year, departmentId, search);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Monthly attendance summary retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve monthly attendance summary",
    });
  }
};

export const getEmployeeMonthlyDetailedLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.query.employeeId as string;
    if (!employeeId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Employee ID is required",
      });
      return;
    }

    const month = req.query.month !== undefined ? Number(req.query.month) : undefined;
    const year = req.query.year !== undefined ? Number(req.query.year) : undefined;

    const result = await attendanceService.getEmployeeMonthlyDetailedLog(employeeId, month, year);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee monthly detailed log retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve employee detailed log",
    });
  }
};

export const getAttendancePolicy = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await attendanceService.getOrCreatePolicy();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attendance policy retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve attendance policy",
    });
  }
};

export const updateAttendancePolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await attendanceService.updateAttendancePolicy(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Attendance policy updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update attendance policy",
    });
  }
};
