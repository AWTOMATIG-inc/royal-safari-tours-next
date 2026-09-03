import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as subscriberService from "./subscriber.service";

export const createSubscriber = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email address is required",
      });
      return;
    }
    const result = await subscriberService.createSubscriber({ email, name });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Subscribed to newsletter successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to subscribe",
    });
  }
};

export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const result = await subscriberService.getAllSubscribers({ search, page, limit });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Newsletter subscribers fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch subscribers",
    });
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await subscriberService.deleteSubscriber(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete subscriber",
    });
  }
};
