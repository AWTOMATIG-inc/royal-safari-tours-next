import { z } from "zod";

const emptyStringToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const stringToBoolean = (val: unknown) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === "true" || trimmed === "1") return true;
    if (trimmed === "false" || trimmed === "0") return false;
  }
  return val;
};

export const createEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Employee name must be at least 2 characters")
    .max(100, "Employee name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),
  phone: z
    .preprocess(emptyStringToUndefined, z.string().trim().max(20, "Phone must be at most 20 characters").optional()),
  departmentId: z
    .string()
    .trim()
    .min(1, "Department ID or Name is required"),
  designationId: z
    .string()
    .trim()
    .min(1, "Designation ID or Name is required"),
  employmentTypeId: z
    .string()
    .trim()
    .min(1, "Employment Type ID or Name is required"),
  employmentStatusId: z
    .string()
    .trim()
    .min(1, "Employment Status ID or Name is required"),
  joiningDate: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  managerId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  hrNotes: z
    .preprocess(emptyStringToUndefined, z.string().trim().max(1000, "HR Notes must be at most 1000 characters").optional()),
  createUserAccount: z
    .preprocess(stringToBoolean, z.boolean().optional()),
  password: z
    .preprocess(emptyStringToUndefined, z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters").optional()),
});

export const updateEmployeeSchema = z.object({
  name: z
    .preprocess(emptyStringToUndefined, z.string().trim().min(2, "Employee name must be at least 2 characters").max(100, "Employee name must be at most 100 characters").optional()),
  email: z
    .preprocess(emptyStringToUndefined, z.string().trim().email("Invalid email format").max(255, "Email must be at most 255 characters").optional()),
  phone: z
    .preprocess(emptyStringToUndefined, z.string().trim().max(20, "Phone must be at most 20 characters").optional()),
  departmentId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  designationId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  employmentTypeId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  employmentStatusId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  joiningDate: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  managerId: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
  hrNotes: z
    .preprocess(emptyStringToUndefined, z.string().trim().max(1000, "HR Notes must be at most 1000 characters").optional()),
  photo: z
    .preprocess(emptyStringToUndefined, z.string().trim().optional()),
});
