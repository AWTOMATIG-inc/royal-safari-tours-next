import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Employee name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  departmentId: z.string().min(1, "Department ID is required"),
  designationId: z.string().min(1, "Designation ID is required"),
  employmentTypeId: z.string().min(1, "Employment Type ID is required"),
  employmentStatusId: z.string().min(1, "Employment Status ID is required"),
  joiningDate: z.string().optional(),
  managerId: z.string().optional(),
  hrNotes: z.string().optional(),
  createUserAccount: z.boolean().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2, "Employee name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  employmentTypeId: z.string().optional(),
  employmentStatusId: z.string().optional(),
  joiningDate: z.string().optional(),
  managerId: z.string().optional(),
  hrNotes: z.string().optional(),
  photo: z.string().optional(),
});
