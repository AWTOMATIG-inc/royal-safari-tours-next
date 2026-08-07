import { z } from "zod";

export const createEmploymentTypeSchema = z.object({
  name: z.string().min(2, "Employment type name must be at least 2 characters"),
});

export const updateEmploymentTypeSchema = z.object({
  name: z.string().min(2, "Employment type name must be at least 2 characters").optional(),
});
