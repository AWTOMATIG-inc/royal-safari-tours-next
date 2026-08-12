import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as employeeService from "./employee.service";

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const photoUrl = req.file ? `/uploads/photos/${req.file.filename}` : undefined;
    const result = await employeeService.createEmployee(req.body, photoUrl);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Employee created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create employee",
    });
  }
};

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await employeeService.getAllEmployees(req.query as any);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employees retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve employees",
    });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employeeService.getEmployeeById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee profile retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Employee not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve employee profile",
    });
  }
};

export const getEmployeeSelfProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorized" });
      return;
    }

    const result = await employeeService.getEmployeeSelfProfile(user.id, user.email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Personal employee profile retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error: error.message || "Employee profile not found",
    });
  }
};

export const updateEmployeeSelfProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorized" });
      return;
    }

    const photoUrl = req.file ? `/uploads/photos/${req.file.filename}` : undefined;
    const result = await employeeService.updateEmployeeSelfProfile(
      user.id,
      user.email,
      req.body,
      photoUrl
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Personal profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update personal profile",
    });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const photoUrl = req.file ? `/uploads/photos/${req.file.filename}` : undefined;

    const result = await employeeService.updateEmployee(id, req.body, photoUrl);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee updated successfully",
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
      error: error.message || "Failed to update employee",
    });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await employeeService.deleteEmployee(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Employee profile deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("not found") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to delete employee",
    });
  }
};
