import { z } from "zod";

export const createDesignationSchema = z.object({
  name: z.string().trim().min(2, "Designation name must be at least 2 characters").max(100, "Designation name must be at most 100 characters"),
  description: z.string().trim().max(500, "Description must be at most 500 characters").optional(),
});

export const updateDesignationSchema = z.object({
  name: z.string().trim().min(2, "Designation name must be at least 2 characters").max(100, "Designation name must be at most 100 characters").optional(),
  description: z.string().trim().max(500, "Description must be at most 500 characters").optional(),
});
