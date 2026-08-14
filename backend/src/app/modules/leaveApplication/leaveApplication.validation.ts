import { z } from "zod";

export const applyLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters long"),
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED"]),
  rejectionReason: z.string().optional(),
});

export const updateLeaveBalanceSchema = z.object({
  totalDays: z.number().int().min(0, "Total days must be a non-negative integer"),
});
