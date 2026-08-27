import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as galleryService from "./galleryItem.service";

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.imageUrl || "";

    if (req.file) {
      imageUrl = `/uploads/gallery/${req.file.filename}`;
    }

    if (!imageUrl && !req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "An image file or imageUrl is required",
      });
      return;
    }

    const result = await galleryService.createGalleryItem({
      ...req.body,
      imageUrl,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Gallery item created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create gallery item",
    });
  }
};

export const getAllGalleryItems = async (req: Request, res: Response) => {
  try {
    const destination = typeof req.query.destination === "string" ? req.query.destination : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await galleryService.getAllGalleryItems({
      destination,
      search,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Gallery items fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch gallery items",
    });
  }
};

export const getSingleGalleryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await galleryService.getSingleGalleryItem(id);

    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Gallery item not found",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Gallery item fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch gallery item",
    });
  }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/gallery/${req.file.filename}`;
    }

    const result = await galleryService.updateGalleryItem(id, {
      ...req.body,
      imageUrl,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Gallery item updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update gallery item",
    });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await galleryService.deleteGalleryItem(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Gallery item deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete gallery item",
    });
  }
};
