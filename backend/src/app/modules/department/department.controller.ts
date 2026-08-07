import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as departmentService from "./department.service";

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await departmentService.createDepartment(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Department created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message.includes("already exists") ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create department",
    });
  }
};

export const getAllDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await departmentService.getAllDepartments();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Departments retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve departments",
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await departmentService.getDepartmentById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Department retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Department not found" ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to retrieve department",
    });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await departmentService.updateDepartment(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Department updated successfully",
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
      error: error.message || "Failed to update department",
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await departmentService.deleteDepartment(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Department deleted successfully",
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
      error: error.message || "Failed to delete department",
    });
  }
};
