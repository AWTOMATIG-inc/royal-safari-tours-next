import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error: any) {
    res.status(error.message === "Email already exists!" ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

    // Set HTTP-only Cookies
    res.cookie("token", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // Return Access Token & Refresh Token explicitly in JSON response body for API / Postman clients
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      token: accessToken, // Alias for backward compatibility
      user,
    });
  } catch (error: any) {
    res.status(error.message === "Invalid credentials" ? StatusCodes.UNAUTHORIZED : StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Login failed",
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshTokenService(token);

    res.cookie("token", result.accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: result.accessToken,
      token: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: error.message || "Invalid or expired refresh token",
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Logout failed",
    });
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorized" });
      return;
    }
    const result = await authService.getUserProfile(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      user: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: error.message || "Profile retrieval failed",
    });
  }
};
