import { Department } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const createDepartment = async (payload: { name: string; description?: string }): Promise<Department> => {
  const existing = await prisma.department.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new Error("Department with this name already exists");
  }

  return await prisma.department.create({
    data: payload,
  });
};

export const getAllDepartments = async () => {
  return await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });
};

export const getDepartmentById = async (id: string) => {
  const result = await prisma.department.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!result) {
    throw new Error("Department not found");
  }

  return result;
};

export const updateDepartment = async (
  id: string,
  payload: { name?: string; description?: string }
): Promise<Department> => {
  const existing = await prisma.department.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Department not found");
  }

  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.department.findUnique({
      where: { name: payload.name },
    });
    if (duplicate) {
      throw new Error("Another department with this name already exists");
    }
  }

  return await prisma.department.update({
    where: { id },
    data: payload,
  });
};

export const deleteDepartment = async (id: string): Promise<Department> => {
  const existing = await prisma.department.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!existing) {
    throw new Error("Department not found");
  }

  if (existing._count.employees > 0) {
    throw new Error(
      `Cannot delete department because ${existing._count.employees} employee(s) are assigned to it`
    );
  }

  return await prisma.department.delete({
    where: { id },
  });
};
