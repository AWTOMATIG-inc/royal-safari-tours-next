import { prisma } from "../../utils/prisma";

const DEFAULT_LEAVE_TYPES = [
  {
    name: "Casual Leave",
    description: "Standard casual leave allocated annually for urgent personal matters.",
    defaultDaysPerYear: 10,
  },
  {
    name: "Sick Leave",
    description: "Medical or health-related leave allocated annually.",
    defaultDaysPerYear: 14,
  },
  {
    name: "Paid Leave",
    description: "Annual paid vacation leave entitlement.",
    defaultDaysPerYear: 15,
  },
];

export const ensureDefaultLeaveTypes = async () => {
  const count = await prisma.leaveType.count();
  if (count === 0) {
    for (const type of DEFAULT_LEAVE_TYPES) {
      await prisma.leaveType.upsert({
        where: { name: type.name },
        update: {},
        create: type,
      });
    }
  }
};

export const getAllLeaveTypes = async () => {
  await ensureDefaultLeaveTypes();

  return await prisma.leaveType.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          applications: true,
          balances: true,
        },
      },
    },
  });
};

export const getLeaveTypeById = async (id: string) => {
  const leaveType = await prisma.leaveType.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          applications: true,
          balances: true,
        },
      },
    },
  });

  if (!leaveType) {
    throw new Error("Leave type not found");
  }

  return leaveType;
};

export const createLeaveType = async (payload: {
  name: string;
  description?: string;
  defaultDaysPerYear?: number;
}) => {
  const existing = await prisma.leaveType.findUnique({
    where: { name: payload.name.trim() },
  });

  if (existing) {
    throw new Error("A leave type with this name already exists");
  }

  return await prisma.leaveType.create({
    data: {
      name: payload.name.trim(),
      description: payload.description ? payload.description.trim() : null,
      defaultDaysPerYear: payload.defaultDaysPerYear || 10,
    },
  });
};

export const updateLeaveType = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
    defaultDaysPerYear?: number;
  }
) => {
  const leaveType = await prisma.leaveType.findUnique({
    where: { id },
  });

  if (!leaveType) {
    throw new Error("Leave type not found");
  }

  if (payload.name && payload.name.trim() !== leaveType.name) {
    const duplicate = await prisma.leaveType.findUnique({
      where: { name: payload.name.trim() },
    });
    if (duplicate) {
      throw new Error("A leave type with this name already exists");
    }
  }

  const updatedLeaveType = await prisma.leaveType.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name.trim() }),
      ...(payload.description !== undefined && {
        description: payload.description ? payload.description.trim() : null,
      }),
      ...(payload.defaultDaysPerYear !== undefined && {
        defaultDaysPerYear: payload.defaultDaysPerYear,
      }),
    },
  });

  if (payload.defaultDaysPerYear !== undefined) {
    const currentYear = new Date().getFullYear();
    await prisma.employeeLeaveBalance.updateMany({
      where: {
        leaveTypeId: id,
        year: currentYear,
      },
      data: {
        totalDays: payload.defaultDaysPerYear,
      },
    });
  }

  return updatedLeaveType;
};

export const deleteLeaveType = async (id: string) => {
  const leaveType = await prisma.leaveType.findUnique({
    where: { id },
  });

  if (!leaveType) {
    throw new Error("Leave type not found");
  }

  return await prisma.leaveType.delete({
    where: { id },
  });
};
