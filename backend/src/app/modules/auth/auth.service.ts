import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "@prisma/client";

export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  const isExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isExist) {
    throw new Error("Email already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.USER, // Default role
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

export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
  };

  // Sign Access Token (1d default)
  const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });

  // Sign Refresh Token (7d default)
  const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
    expiresIn: config.refreshExpiresIn as any,
  });

  return {
    user: tokenPayload,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, config.refreshSecret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };

    const newAccessToken = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    return {
      accessToken: newAccessToken,
      user: tokenPayload,
    };
  } catch (error: any) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    throw new Error("User profile not found");
  }

  return user;
};
