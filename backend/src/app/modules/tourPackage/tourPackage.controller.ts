import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as packageService from "./tourPackage.service";

export const createPackage = async (req: Request, res: Response) => {
  try {
    const result = await packageService.createPackage(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Tour package created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create tour package",
    });
  }
};

export const getAllPackages = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const location = typeof req.query.location === "string" ? req.query.location : undefined;
    const isFeatured = req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const result = await packageService.getAllPackages({ search, location, isFeatured, page, limit });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour packages fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch tour packages",
    });
  }
};

export const getPackageBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params as { slugOrId: string };
    const result = await packageService.getPackageBySlugOrId(slugOrId);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tour package not found",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour package fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch tour package",
    });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await packageService.updatePackage(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour package updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update tour package",
    });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await packageService.deletePackage(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour package deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete tour package",
    });
  }
};
