import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as locationService from "./tourLocation.service";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const result = await locationService.createLocation(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Tour location created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create tour location",
    });
  }
};

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const isFeatured = req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await locationService.getAllLocations({ search, isFeatured, page, limit });
    if (result && typeof result === "object" && "meta" in result) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Tour locations fetched successfully",
        meta: (result as any).meta,
        data: (result as any).data,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour locations fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch tour locations",
    });
  }
};

export const getLocationByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params as { idOrSlug: string };
    const result = await locationService.getLocationByIdOrSlug(idOrSlug);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tour location not found",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour location fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch tour location",
    });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await locationService.updateLocation(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour location updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update tour location",
    });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await locationService.deleteLocation(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour location deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete tour location",
    });
  }
};
