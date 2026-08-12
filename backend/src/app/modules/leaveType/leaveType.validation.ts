import { z } from "zod";

export const createLeaveTypeSchema = z.object({
  name: z.string().min(2, "Leave type name must be at least 2 characters"),
  description: z.string().optional(),
  defaultDaysPerYear: z
    .number()
    .int()
    .min(1, "Default days per year must be at least 1")
    .default(10),
});

export const updateLeaveTypeSchema = z.object({
  name: z.string().min(2, "Leave type name must be at least 2 characters").optional(),
  description: z.string().optional(),
  defaultDaysPerYear: z.number().int().min(1, "Default days per year must be at least 1").optional(),
});
