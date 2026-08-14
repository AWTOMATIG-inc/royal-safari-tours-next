import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

export const authorize = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: User credentials not verified",
        });
        return;
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You do not have permission to access this resource",
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: "Internal server authorization validation error",
      });
    }
  };
};
