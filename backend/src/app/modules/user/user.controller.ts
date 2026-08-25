import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as userService from "./user.service";
import { Role } from "@prisma/client";
import path from "path";
import fs from "fs";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1", 10);
    const limit = parseInt(req.query.limit as string || "10", 10);
    const search = req.query.search as string | undefined;

    const { users, total } = await userService.getAllUsers(page, limit, search);

    res.status(StatusCodes.OK).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to fetch users",
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await userService.getUserById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      user: result,
    });
  } catch (error: any) {
    res.status(error.message === "User not found" ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to fetch user",
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (req.body.role && req.user?.role !== Role.SUPER_ADMIN && req.user?.role !== Role.ADMIN) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: "Forbidden: Only administrators can modify roles",
      });
      return;
    }

    const payload = { ...req.body };

    if (req.file) {
      payload.avatar = `/uploads/avatars/${req.file.filename}`;

      if (req.body.oldAvatar) {
        const oldAvatarPath = path.join(process.cwd(), "uploads/avatars", req.body.oldAvatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
    }

    const result = await userService.updateUser(id, payload);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User updated successfully",
      user: result,
    });
  } catch (error: any) {
    const isLimitError = error.message === "Maximum of 5 admin accounts allowed";
    res.status(isLimitError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to update user",
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await userService.deleteUser(id, req.user?.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(error.message === "User not found" ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to delete user",
    });
  }
};
