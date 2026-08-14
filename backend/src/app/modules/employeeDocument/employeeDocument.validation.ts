import { z } from "zod";

export const uploadDocumentSchema = z.object({
  documentName: z.string().trim().min(1, "Document name is required").max(255, "Document name must be at most 255 characters").optional(),
});

export const updateDocumentSchema = z.object({
  documentName: z.string().trim().min(1, "Document name is required").max(255, "Document name must be at most 255 characters"),
});
