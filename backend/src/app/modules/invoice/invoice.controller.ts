import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import { InvoiceService } from "./invoice.service";

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized access",
      });
      return;
    }

    const result = await InvoiceService.createInvoice(user.id, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Invoice created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create invoice",
    });
  }
};

export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized access",
      });
      return;
    }

    const filters = {
      search: req.query.search as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await InvoiceService.getAllInvoices(user.id, user.role, filters);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Invoices retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve invoices",
    });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized access",
      });
      return;
    }

    const id = req.params.id as string;
    const result = await InvoiceService.getInvoiceById(user.id, user.role, id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Invoice details retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error: error.message || "Invoice not found",
    });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized access",
      });
      return;
    }

    const id = req.params.id as string;
    const result = await InvoiceService.updateInvoice(user.id, user.role, id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Invoice updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update invoice",
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized access",
      });
      return;
    }

    const id = req.params.id as string;
    const result = await InvoiceService.deleteInvoice(user.role, id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to delete invoice",
    });
  }
};

export const InvoiceController = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
