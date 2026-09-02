import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as mediaService from "./media.service";
import { OptimizedImageResult } from "../../utils/imageOptimizer";

export const getMediaItems = async (req: Request, res: Response) => {
  try {
    const folderPath = typeof req.query.folderPath === "string" ? req.query.folderPath : "";
    const result = await mediaService.getMediaItems(folderPath);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Media items fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch media items",
    });
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { folderName, parentFolderPath } = req.body;
    if (!folderName) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "folderName is required",
      });
      return;
    }
    const result = await mediaService.createMediaFolder(folderName, parentFolderPath || "");
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Media folder created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create folder",
    });
  }
};

export const updateMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name is required",
      });
      return;
    }
    const result = await mediaService.updateMediaItem(id, name.trim());
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Media item updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update media item",
    });
  }
};

export const uploadMedia = async (
  req: Request & { optimizedFiles?: OptimizedImageResult[] },
  res: Response
) => {
  try {
    const folderPath = (req.body.folderPath || req.query.folderPath || "") as string;
    const optimizedFiles = req.optimizedFiles || [];

    if (optimizedFiles.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No files uploaded or optimized",
      });
      return;
    }

    const records = await mediaService.createMediaFileRecords(optimizedFiles, folderPath);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${records.length} files uploaded and optimized successfully`,
      data: records,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to process media upload",
    });
  }
};

export const deleteMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await mediaService.deleteMediaItem(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Media item deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete media item",
    });
  }
};
