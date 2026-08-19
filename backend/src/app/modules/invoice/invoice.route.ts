import express from "express";
import { auth } from "../../middlewares/auth";
import { InvoiceController } from "./invoice.controller";

const router = express.Router();

// GET all invoices (Admin gets all, Employee gets own created)
router.get(
  "/",
  auth(),
  InvoiceController.getAllInvoices
);

// GET single invoice by ID
router.get(
  "/:id",
  auth(),
  InvoiceController.getInvoiceById
);

// POST create invoice
router.post(
  "/",
  auth(),
  InvoiceController.createInvoice
);

// PATCH update invoice
router.patch(
  "/:id",
  auth(),
  InvoiceController.updateInvoice
);

// DELETE invoice (Admin only enforced in service)
router.delete(
  "/:id",
  auth(),
  InvoiceController.deleteInvoice
);

export const InvoiceRoutes = router;
