import { z } from "zod";

export const createEmploymentStatusSchema = z.object({
  name: z.string().trim().min(2, "Employment status name must be at least 2 characters").max(100, "Employment status name must be at most 100 characters"),
});

export const updateEmploymentStatusSchema = z.object({
  name: z.string().trim().min(2, "Employment status name must be at least 2 characters").max(100, "Employment status name must be at most 100 characters").optional(),
});
