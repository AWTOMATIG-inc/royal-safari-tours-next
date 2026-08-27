import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "@prisma/client";
import { generateOTP, verifyOTPHash } from "./otpGenerator";
import { otpStore } from "./otpStore";
import { sendOTPEmail } from "./emailSender";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar: string | null;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

export const registerUser = async (payload: RegisterPayload) => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const isExist = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (isExist) {
    throw new Error("Email already exists!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (payload: LoginPayload) => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS: Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("ACCOUNT_DEACTIVATED: Your account status is Inactive. Access to the dashboard is disabled.");
  }

  // Check linked Employee employment status
  const linkedEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: user.email.toLowerCase() },
      ],
    },
    include: {
      employmentStatus: true,
    },
  });

  if (linkedEmployee && linkedEmployee.employmentStatus?.name?.toLowerCase() === "inactive") {
    throw new Error("ACCOUNT_DEACTIVATED: Your employee account status is Inactive. Access to the dashboard is disabled.");
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("INVALID_CREDENTIALS: Invalid email or password");
  }

  // Super Admin OTP Bypass: Issue tokens directly without 2FA step
  if (user.role === Role.SUPER_ADMIN) {
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };

    const rememberMe = Boolean(payload.rememberMe);
    const jwtExpiry = rememberMe ? "365d" : (config.jwtExpiresIn || "1d");
    const refreshExpiry = rememberMe ? "365d" : (config.refreshExpiresIn || "7d");

    const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: jwtExpiry as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
      expiresIn: refreshExpiry as jwt.SignOptions["expiresIn"],
    });

    return {
      requires2FA: false,
      user: tokenPayload,
      accessToken,
      refreshToken,
      rememberMe,
    };
  }

  const existingRecord = await otpStore.get(normalizedEmail);
  if (existingRecord && Date.now() - existingRecord.lastSentAt < 60000) {
    const secondsRemaining = Math.ceil((60000 - (Date.now() - existingRecord.lastSentAt)) / 1000);
    throw new Error(`OTP_COOLDOWN: Please wait ${secondsRemaining} seconds before requesting a new code`);
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + config.otpExpiryMinutes * 60 * 1000;

  await otpStore.set(normalizedEmail, {
    hash: otp.hash,
    expiresAt,
    attempts: 0,
    lastSentAt: Date.now(),
  });

  await sendOTPEmail(user.email, otp.plain, user.name);

  return {
    requires2FA: true,
    maskedEmail: maskEmail(user.email),
    email: normalizedEmail,
  };
};

export const verifyOtpService = async (email: string, plainOtp: string, rememberMe: boolean = false) => {
  const normalizedEmail = email.toLowerCase().trim();

  const record = await otpStore.get(normalizedEmail);
  if (!record) {
    throw new Error("OTP_NOT_FOUND: Session expired. Please login again.");
  }

  if (Date.now() > record.expiresAt) {
    await otpStore.delete(normalizedEmail);
    throw new Error("OTP_EXPIRED: Verification code expired. Please login again.");
  }

  if (record.attempts >= config.otpMaxAttempts) {
    await otpStore.delete(normalizedEmail);
    throw new Error("OTP_MAX_ATTEMPTS: Too many failed attempts. Please login again.");
  }

  const isValid = verifyOTPHash(plainOtp, record.hash);

  if (!isValid) {
    record.attempts += 1;
    await otpStore.set(normalizedEmail, record);
    const remaining = config.otpMaxAttempts - record.attempts;

    if (remaining <= 0) {
      await otpStore.delete(normalizedEmail);
      throw new Error("OTP_MAX_ATTEMPTS: Too many failed attempts. Please login again.");
    }

    throw new Error(`OTP_INVALID: Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`);
  }

  await otpStore.delete(normalizedEmail);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS: User account not found");
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
  };

  const jwtExpiry = rememberMe ? "365d" : (config.jwtExpiresIn || "1d");
  const refreshExpiry = rememberMe ? "365d" : (config.refreshExpiresIn || "7d");

  const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: jwtExpiry as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
    expiresIn: refreshExpiry as jwt.SignOptions["expiresIn"],
  });

  return {
    user: tokenPayload,
    accessToken,
    refreshToken,
  };
};

export const resendOtpService = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS: Account not found");
  }

  const existingRecord = await otpStore.get(normalizedEmail);
  if (existingRecord && Date.now() - existingRecord.lastSentAt < 60000) {
    const secondsRemaining = Math.ceil((60000 - (Date.now() - existingRecord.lastSentAt)) / 1000);
    throw new Error(`OTP_COOLDOWN: Please wait ${secondsRemaining} seconds before requesting a new code`);
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + config.otpExpiryMinutes * 60 * 1000;

  await otpStore.set(normalizedEmail, {
    hash: otp.hash,
    expiresAt,
    attempts: 0,
    lastSentAt: Date.now(),
  });

  await sendOTPEmail(user.email, otp.plain, user.name);

  return {
    success: true,
    message: "A new verification code has been sent to your email.",
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = jwt.verify(refreshToken, config.refreshSecret) as { id: string };

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
  };

  const newAccessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return {
    accessToken: newAccessToken,
    user: tokenPayload,
  };
};

export const getUserProfile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const changePassword = async (userId: string, currentPass: string, newPass: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPass, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPass, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return { message: "Password updated successfully" };
};
