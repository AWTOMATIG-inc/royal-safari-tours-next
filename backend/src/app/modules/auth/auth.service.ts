import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "@prisma/client";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar: string | null;
}

export const registerUser = async (payload: RegisterPayload) => {
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

  const tokenPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
  };

  const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
    expiresIn: config.refreshExpiresIn as jwt.SignOptions["expiresIn"],
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
  } catch (error: unknown) {
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

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};
