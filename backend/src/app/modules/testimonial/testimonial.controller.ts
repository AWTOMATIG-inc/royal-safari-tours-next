import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as testimonialService from "./testimonial.service";

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const result = await testimonialService.createTestimonial(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Testimonial created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create testimonial",
    });
  }
};

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const isPublished = req.query.isPublished === "true" ? true : req.query.isPublished === "false" ? false : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await testimonialService.getAllTestimonials({ isPublished, page, limit });
    if (result && typeof result === "object" && "meta" in result) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Testimonials fetched successfully",
        meta: (result as any).meta,
        data: (result as any).data,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Testimonials fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch testimonials",
    });
  }
};

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await testimonialService.getTestimonialById(id);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Testimonial not found",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Testimonial fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch testimonial",
    });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await testimonialService.updateTestimonial(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Testimonial updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update testimonial",
    });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await testimonialService.deleteTestimonial(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete testimonial",
    });
  }
};
