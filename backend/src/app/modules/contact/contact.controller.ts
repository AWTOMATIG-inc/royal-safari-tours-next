import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as contactService from "./contact.service";
import { ContactStatus } from "@prisma/client";

export const createContact = async (req: Request, res: Response) => {
  try {
    const result = await contactService.createContact(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Contact inquiry submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to submit contact inquiry",
    });
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? (req.query.status as ContactStatus) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const result = await contactService.getAllContacts({ search, status, page, limit });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Contact inquiries fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch contact inquiries",
    });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await contactService.getContactById(id);
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Contact inquiry not found",
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Contact inquiry fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch contact inquiry",
    });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { status, notes } = req.body;
    const result = await contactService.updateContactStatus(id, status, notes);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Contact inquiry status updated",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update contact inquiry",
    });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await contactService.deleteContact(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Contact inquiry deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to delete contact inquiry",
    });
  }
};
