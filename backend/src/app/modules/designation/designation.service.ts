import { Designation } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const createDesignation = async (payload: { name: string; description?: string }): Promise<Designation> => {
  const existing = await prisma.designation.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new Error("Designation with this name already exists");
  }

  return await prisma.designation.create({
    data: payload,
  });
};

export const getAllDesignations = async () => {
  return await prisma.designation.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });
};

export const getDesignationById = async (id: string) => {
  const result = await prisma.designation.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!result) {
    throw new Error("Designation not found");
  }

  return result;
};

export const updateDesignation = async (
  id: string,
  payload: { name?: string; description?: string }
): Promise<Designation> => {
  const existing = await prisma.designation.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Designation not found");
  }

  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.designation.findUnique({
      where: { name: payload.name },
    });
    if (duplicate) {
      throw new Error("Another designation with this name already exists");
    }
  }

  return await prisma.designation.update({
    where: { id },
    data: payload,
  });
};

export const deleteDesignation = async (id: string): Promise<Designation> => {
  const existing = await prisma.designation.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!existing) {
    throw new Error("Designation not found");
  }

  if (existing._count.employees > 0) {
    throw new Error(
      `Cannot delete designation because ${existing._count.employees} employee(s) are assigned to it`
    );
  }

  return await prisma.designation.delete({
    where: { id },
  });
};
