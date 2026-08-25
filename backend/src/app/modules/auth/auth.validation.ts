import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format").max(255, "Email must be at most 255 characters"),
  password: z.string().min(1, "Password is required").max(128, "Password must be at most 128 characters"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  otp: z.string().trim().length(6, "Verification code must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(128, "Password must be at most 128 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(128, "New password must be at most 128 characters"),
});
