import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import { BookingStatus } from "@prisma/client";
import {
  createBookingEnquiryService,
  getAllBookingEnquiriesService,
  getBookingEnquiryByIdService,
  updateBookingEnquiryService,
  deleteBookingEnquiryService,
} from "./bookingEnquiry.service";

export const createBookingEnquiry = async (req: Request, res: Response) => {
  try {
    const result = await createBookingEnquiryService(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booking enquiry submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to submit booking enquiry",
    });
  }
};

export const getAllBookingEnquiries = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? (req.query.status as BookingStatus) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await getAllBookingEnquiriesService({ search, status, page, limit });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking enquiries fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch booking enquiries",
    });
  }
};

export const getBookingEnquiryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await getBookingEnquiryByIdService(id);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking enquiry not found",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking enquiry fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch booking enquiry",
    });
  }
};

export const updateBookingEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await updateBookingEnquiryService(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking enquiry updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update booking enquiry",
    });
  }
};

export const deleteBookingEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await deleteBookingEnquiryService(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking enquiry deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete booking enquiry",
    });
  }
};
