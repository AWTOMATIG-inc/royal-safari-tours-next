import { z } from "zod";

export const checkInSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationName: z.string().optional(),
  remarks: z.string().optional(),
});

export const checkOutSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationName: z.string().optional(),
  remarks: z.string().optional(),
});

export const updateAttendancePolicySchema = z.object({
  workStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:mm (e.g. 09:00)").optional(),
  workEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:mm (e.g. 18:00)").optional(),
  lateGraceMinutes: z.number().int().min(0).max(120).optional(),
  earlyOutGraceMinutes: z.number().int().min(0).max(120).optional(),
  halfDayHours: z.number().min(1).max(12).optional(),
});
