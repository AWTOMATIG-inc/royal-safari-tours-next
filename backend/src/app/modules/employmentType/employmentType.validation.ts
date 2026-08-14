import { z } from "zod";

export const createEmploymentTypeSchema = z.object({
  name: z.string().trim().min(2, "Employment type name must be at least 2 characters").max(100, "Employment type name must be at most 100 characters"),
});

export const updateEmploymentTypeSchema = z.object({
  name: z.string().trim().min(2, "Employment type name must be at least 2 characters").max(100, "Employment type name must be at most 100 characters").optional(),
});
