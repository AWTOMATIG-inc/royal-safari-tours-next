import { z } from "zod";

export const createEmploymentStatusSchema = z.object({
  name: z.string().min(2, "Employment status name must be at least 2 characters"),
});

export const updateEmploymentStatusSchema = z.object({
  name: z.string().min(2, "Employment status name must be at least 2 characters").optional(),
});
