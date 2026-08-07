import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { Role } from "@prisma/client";

interface DecodedUser {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string | null;
}

export const auth = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract from Authorization header, Cookies, or custom header
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : null;

      const cookieToken = req.cookies?.token || req.cookies?.accessToken;
      const customHeaderToken = req.headers["x-access-token"] as string | undefined;

      const token = bearerToken || cookieToken || customHeaderToken;

      if (!token) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Missing authentication token. Please login to receive a Bearer token.",
        });
        return;
      }

      const decoded = jwt.verify(token, config.jwtSecret) as DecodedUser;

      if (!decoded || !decoded.id) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Invalid authentication token payload",
        });
        return;
      }

      // Attach user payload to Express Request
      req.user = decoded;
      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.name === "TokenExpiredError"
          ? "Unauthorized: Access token has expired. Please use /api/v1/auth/refresh-token"
          : "Unauthorized: Invalid or corrupted authentication token",
      });
    }
  };
};
