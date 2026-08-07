import { Request, Response } from "express";
import * as userService from "./user.service";
import { Role } from "@prisma/client";
import path from "path";
import fs from "fs";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1", 10);
    const limit = parseInt(req.query.limit as string || "10", 10);

    const { users, total } = await userService.getAllUsers(page, limit);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch users",
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // RBAC: Only SUPER_ADMIN or ADMIN can modify user roles
    if (req.body.role && req.user?.role !== Role.SUPER_ADMIN && req.user?.role !== Role.ADMIN) {
      res.status(403).json({
        success: false,
        error: "Forbidden: Only administrators can modify roles",
      });
      return;
    }

    // Prepare payload
    const payload = { ...req.body };

    // Handle file upload avatar
    if (req.file) {
      payload.avatar = req.file.filename;

      // Delete old avatar if it exists
      if (req.body.oldAvatar) {
        const oldAvatarPath = path.join(process.cwd(), "../frontend/uploads/user", req.body.oldAvatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
    }

    const result = await userService.updateUser(id, payload);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result,
    });
  } catch (error: any) {
    const isLimitError = error.message === "Maximum of 5 admin accounts allowed";
    res.status(isLimitError ? 400 : 500).json({
      success: false,
      error: error.message || "Failed to update user",
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    const isNotFound = error.message === "User not found";
    res.status(isNotFound ? 404 : 500).json({
      success: false,
      error: error.message || "Failed to delete user",
    });
  }
};
