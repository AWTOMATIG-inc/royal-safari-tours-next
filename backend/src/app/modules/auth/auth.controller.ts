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
      code: error.message === "Email already exists!" ? "EMAIL_EXISTS" : "REGISTRATION_FAILED",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Verification code sent to your email",
      requires2FA: result.requires2FA,
      email: result.email,
      maskedEmail: result.maskedEmail,
    });
  } catch (error: any) {
    const isInvalid = error.message?.startsWith("INVALID_CREDENTIALS");
    const isCooldown = error.message?.startsWith("OTP_COOLDOWN");

    let statusCode: number = StatusCodes.BAD_REQUEST;
    let code = "LOGIN_FAILED";

    if (isInvalid) {
      statusCode = StatusCodes.UNAUTHORIZED;
      code = "INVALID_CREDENTIALS";
    } else if (isCooldown) {
      statusCode = StatusCodes.TOO_MANY_REQUESTS;
      code = "OTP_COOLDOWN";
    }

    const cleanMessage = error.message ? error.message.replace(/^[A-Z_]+:\s*/, "") : "Login failed";

    res.status(statusCode).json({
      success: false,
      error: cleanMessage,
      code,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const { user, accessToken, refreshToken } = await authService.verifyOtpService(email, otp);

    const accessTokenMaxAge = 24 * 60 * 60 * 1000;
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: accessTokenMaxAge,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: refreshTokenMaxAge,
      sameSite: "lax",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      token: accessToken,
      user,
    });
  } catch (error: any) {
    const msg = error.message || "";
    let statusCode: number = StatusCodes.BAD_REQUEST;
    let code = "OTP_INVALID";

    if (msg.startsWith("OTP_NOT_FOUND")) {
      statusCode = StatusCodes.BAD_REQUEST;
      code = "OTP_NOT_FOUND";
    } else if (msg.startsWith("OTP_EXPIRED")) {
      statusCode = StatusCodes.BAD_REQUEST;
      code = "OTP_EXPIRED";
    } else if (msg.startsWith("OTP_MAX_ATTEMPTS")) {
      statusCode = StatusCodes.TOO_MANY_REQUESTS;
      code = "OTP_MAX_ATTEMPTS";
    } else if (msg.startsWith("OTP_INVALID")) {
      statusCode = StatusCodes.UNAUTHORIZED;
      code = "OTP_INVALID";
    }

    const cleanMessage = msg.replace(/^[A-Z_]+:\s*/, "") || "OTP verification failed";

    res.status(statusCode).json({
      success: false,
      error: cleanMessage,
      code,
    });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await authService.resendOtpService(email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    const msg = error.message || "";
    let statusCode: number = StatusCodes.BAD_REQUEST;
    let code = "RESEND_FAILED";

    if (msg.startsWith("OTP_COOLDOWN")) {
      statusCode = StatusCodes.TOO_MANY_REQUESTS;
      code = "OTP_COOLDOWN";
    } else if (msg.startsWith("EMAIL_SEND_FAILED")) {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      code = "EMAIL_SEND_FAILED";
    }

    const cleanMessage = msg.replace(/^[A-Z_]+:\s*/, "") || "Resend failed";

    res.status(statusCode).json({
      success: false,
      error: cleanMessage,
      code,
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshTokenService(token);

    const accessTokenMaxAge = 24 * 60 * 60 * 1000;

    res.cookie("token", result.accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: accessTokenMaxAge,
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
      code: "TOKEN_EXPIRED",
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
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorized", code: "TOKEN_MISSING" });
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
      code: "TOKEN_INVALID",
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorized", code: "TOKEN_MISSING" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(userId, currentPassword, newPassword);

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    const status = error.message === "Current password is incorrect"
      ? StatusCodes.BAD_REQUEST
      : error.message === "User not found"
      ? StatusCodes.NOT_FOUND
      : StatusCodes.INTERNAL_SERVER_ERROR;

    res.status(status).json({
      success: false,
      error: error.message || "Failed to change password",
    });
  }
};
