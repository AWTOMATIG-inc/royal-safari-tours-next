import rateLimit from "express-rate-limit";

// Rate Limiter for Login Endpoint: Max 10 requests per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many login requests from this IP. Please try again after 15 minutes.",
    code: "TOO_MANY_REQUESTS",
  },
});

// Rate Limiter for OTP Verification Endpoint: Max 5 requests per 15 minutes
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many OTP verification attempts. Please try again after 15 minutes.",
    code: "TOO_MANY_REQUESTS",
  },
});

// Rate Limiter for Resend OTP Endpoint: Max 3 requests per 15 minutes
export const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many resend requests. Please try again after 15 minutes.",
    code: "TOO_MANY_REQUESTS",
  },
});
