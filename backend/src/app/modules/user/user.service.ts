import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../utils/prisma";

interface UpdateUserPayload {
  name?: string;
  role?: string;
  avatar?: string;
}

export const getAllUsers = async (
  page: number,
  limit: number,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (search && search.trim()) {
    const searchTerm = search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const { role, name, avatar } = payload;
  const updateData: Prisma.UserUpdateInput = {};

  if (name !== undefined) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;

  const currentTarget = await prisma.user.findUnique({
    where: { id },
  });

  if (!currentTarget) {
    throw new Error("User not found");
  }

  if (role !== undefined) {
    const isCurrentlyAdmin = currentTarget.role === Role.ADMIN || currentTarget.role === Role.SUPER_ADMIN;

    if (isCurrentlyAdmin) {
      throw new Error("Admin account access levels cannot be modified");
    }

    const uppercaseRole = role.toUpperCase() as Role;
    if (uppercaseRole === Role.ADMIN || uppercaseRole === Role.SUPER_ADMIN) {
      const adminCount = await prisma.user.count({
        where: {
          role: {
            in: [Role.ADMIN, Role.SUPER_ADMIN],
          },
        },
      });

      if (!isCurrentlyAdmin && adminCount >= 5) {
        throw new Error("Maximum of 5 admin accounts allowed");
      }
    }
    updateData.role = uppercaseRole;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  return updated;
};

export const deleteUser = async (id: string, currentUserId?: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (currentUserId && (id === currentUserId || user.id === currentUserId)) {
    throw new Error("You cannot delete your own account");
  }

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    throw new Error("Admin accounts cannot be deleted");
  }

  await prisma.user.delete({
    where: { id },
  });

  return user;
};
