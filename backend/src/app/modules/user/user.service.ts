import { Prisma, Role, UserStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";

interface UpdateUserPayload {
  name?: string;
  role?: string;
  avatar?: string;
  status?: UserStatus;
}

export const getAllUsers = async (
  page: number,
  limit: number,
  search?: string,
  role?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  // Filter by role (default to USER to keep regular Users separate from Employees/Staff)
  if (role && role.trim() && role.trim().toUpperCase() !== "ALL") {
    where.role = role.trim().toUpperCase() as Role;
  } else if (!role) {
    where.role = Role.USER;
  }

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
        status: true,
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
      status: true,
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
  const { role, name, avatar, status } = payload;
  const updateData: Prisma.UserUpdateInput = {};

  if (name !== undefined) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (status !== undefined) updateData.status = status;

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
      status: true,
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

  // Check if this user has created invoice records in the system
  const invoiceCount = await prisma.invoice.count({
    where: { createdById: id },
  });

  // 1. Unlink associated Employee profile if present
  await prisma.employee.updateMany({
    where: { userId: id },
    data: { userId: null },
  });

  // If user has created invoices, set status to INACTIVE to preserve audit trails without altering invoices
  if (invoiceCount > 0) {
    const deactivatedUser = await prisma.user.update({
      where: { id },
      data: { status: UserStatus.INACTIVE },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return {
      deactivated: true,
      message: `Account for ${user.name} has invoice records and was safely DEACTIVATED (INACTIVE) to preserve financial audit history.`,
      user: deactivatedUser,
    };
  }

  // If zero invoice records exist, perform hard deletion
  await prisma.user.delete({
    where: { id },
  });

  return {
    deactivated: false,
    message: `User ${user.name} deleted successfully.`,
    user,
  };
};
