import { z } from "zod";

export const createDesignationSchema = z.object({
  name: z.string().min(2, "Designation name must be at least 2 characters"),
  description: z.string().optional(),
});

export const updateDesignationSchema = z.object({
  name: z.string().min(2, "Designation name must be at least 2 characters").optional(),
  description: z.string().optional(),
});
