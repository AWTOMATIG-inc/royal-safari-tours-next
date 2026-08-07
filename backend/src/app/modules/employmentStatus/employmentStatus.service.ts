import { EmploymentStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const createEmploymentStatus = async (payload: { name: string }): Promise<EmploymentStatus> => {
  const existing = await prisma.employmentStatus.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new Error("Employment status with this name already exists");
  }

  return await prisma.employmentStatus.create({
    data: payload,
  });
};

export const getAllEmploymentStatuses = async () => {
  return await prisma.employmentStatus.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });
};

export const getEmploymentStatusById = async (id: string) => {
  const result = await prisma.employmentStatus.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!result) {
    throw new Error("Employment status not found");
  }

  return result;
};

export const updateEmploymentStatus = async (
  id: string,
  payload: { name?: string }
): Promise<EmploymentStatus> => {
  const existing = await prisma.employmentStatus.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Employment status not found");
  }

  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.employmentStatus.findUnique({
      where: { name: payload.name },
    });
    if (duplicate) {
      throw new Error("Another employment status with this name already exists");
    }
  }

  return await prisma.employmentStatus.update({
    where: { id },
    data: payload,
  });
};

export const deleteEmploymentStatus = async (id: string): Promise<EmploymentStatus> => {
  const existing = await prisma.employmentStatus.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!existing) {
    throw new Error("Employment status not found");
  }

  if (existing._count.employees > 0) {
    throw new Error(
      `Cannot delete employment status because ${existing._count.employees} employee(s) are assigned to it`
    );
  }

  return await prisma.employmentStatus.delete({
    where: { id },
  });
};
