import { z } from "zod";

const createInvoiceItemSchema = z.object({
  itemDescription: z.string().min(1, "Item description is required"),
  subDescription: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  rate: z.number().min(0, "Rate must be a positive number"),
});

export const createInvoiceZodSchema = z.object({
  body: z.object({
    clientName: z.string().min(1, "Client name is required"),
    clientPhone: z.string().min(1, "Client phone is required"),
    clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    clientAddress: z.string().optional(),
    invoiceDate: z.string().optional(),
    dueDate: z.string().optional(),
    paymentTerms: z.string().default("Advanced"),
    discount: z.number().min(0).default(0),
    amountPaid: z.number().min(0).default(0),
    notes: z.string().max(80, "Notes cannot exceed 80 characters").optional(),
    items: z.array(createInvoiceItemSchema).min(1, "At least one item is required"),
  }),
});

export const updateInvoiceZodSchema = z.object({
  body: z.object({
    clientName: z.string().min(1).optional(),
    clientPhone: z.string().min(1).optional(),
    clientEmail: z.string().email().optional().or(z.literal("")),
    clientAddress: z.string().optional(),
    invoiceDate: z.string().optional(),
    dueDate: z.string().optional(),
    paymentTerms: z.string().optional(),
    discount: z.number().min(0).optional(),
    amountPaid: z.number().min(0).optional(),
    notes: z.string().max(80, "Notes cannot exceed 80 characters").optional(),
    items: z.array(createInvoiceItemSchema).min(1).optional(),
  }),
});
