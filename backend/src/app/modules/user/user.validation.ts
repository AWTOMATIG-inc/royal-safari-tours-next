import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE", "USER"], {
    error: "Role must be one of: SUPER_ADMIN, ADMIN, HR_MANAGER, EMPLOYEE, USER",
  }).optional(),
  avatar: z.string().trim().optional(),
});
