import { EmploymentType } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const createEmploymentType = async (payload: { name: string }): Promise<EmploymentType> => {
  const existing = await prisma.employmentType.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new Error("Employment type with this name already exists");
  }

  return await prisma.employmentType.create({
    data: payload,
  });
};

export const getAllEmploymentTypes = async () => {
  return await prisma.employmentType.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });
};

export const getEmploymentTypeById = async (id: string) => {
  const result = await prisma.employmentType.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!result) {
    throw new Error("Employment type not found");
  }

  return result;
};

export const updateEmploymentType = async (
  id: string,
  payload: { name?: string }
): Promise<EmploymentType> => {
  const existing = await prisma.employmentType.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Employment type not found");
  }

  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.employmentType.findUnique({
      where: { name: payload.name },
    });
    if (duplicate) {
      throw new Error("Another employment type with this name already exists");
    }
  }

  return await prisma.employmentType.update({
    where: { id },
    data: payload,
  });
};

export const deleteEmploymentType = async (id: string): Promise<EmploymentType> => {
  const existing = await prisma.employmentType.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!existing) {
    throw new Error("Employment type not found");
  }

  if (existing._count.employees > 0) {
    throw new Error(
      `Cannot delete employment type because ${existing._count.employees} employee(s) are assigned to it`
    );
  }

  return await prisma.employmentType.delete({
    where: { id },
  });
};
