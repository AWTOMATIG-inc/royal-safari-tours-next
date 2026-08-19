import { prisma } from "../../utils/prisma";

const generateInvoiceNumber = async (): Promise<string> => {
  // Find all invoices with RST- prefix to determine current highest number
  const existingInvoices = await prisma.invoice.findMany({
    where: {
      invoiceNumber: {
        startsWith: "RST-",
      },
    },
    select: {
      invoiceNumber: true,
    },
  });

  let maxNum = 1000;

  for (const inv of existingInvoices) {
    const match = inv.invoiceNumber.match(/^RST-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  let nextNum = maxNum + 1;

  // Verify uniqueness in database
  while (true) {
    const candidate = `RST-${nextNum}`;
    const existing = await prisma.invoice.findUnique({
      where: { invoiceNumber: candidate },
    });
    if (!existing) {
      return candidate;
    }
    nextNum++;
  }
};

const createInvoice = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true },
  });

  if (!user) {
    throw new Error("User account not found");
  }

  const invoiceNumber = await generateInvoiceNumber();

  const discount = Number(payload.discount) || 0;
  const amountPaid = Number(payload.amountPaid) || 0;

  // Process items & subtotal
  const itemsData = (payload.items || []).map((item: any) => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate) || 0;
    return {
      itemDescription: item.itemDescription,
      subDescription: item.subDescription || null,
      quantity: qty,
      rate: rate,
      amount: qty * rate,
    };
  });

  const subTotal = itemsData.reduce((acc: number, item: any) => acc + item.amount, 0);
  const totalAmount = Math.max(0, subTotal - discount);
  const balanceDue = Math.max(0, totalAmount - amountPaid);

  // Invoice date is permanently fixed to exact creation timestamp
  const invoiceDate = new Date();
  const dueDate = payload.dueDate ? new Date(payload.dueDate) : null;

  const result = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientName: payload.clientName,
      clientPhone: payload.clientPhone,
      clientEmail: payload.clientEmail || null,
      clientAddress: payload.clientAddress || null,
      invoiceDate,
      dueDate,
      paymentTerms: payload.paymentTerms || "Advanced",
      subTotal,
      discount,
      totalAmount,
      amountPaid,
      balanceDue,
      notes: payload.notes || "Booking Money are not Re-fundable",
      createdById: user.id,
      creatorName: user.name,
      items: {
        create: itemsData,
      },
    },
    include: {
      items: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          employee: {
            select: {
              employeeId: true,
              designation: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return result;
};

const getAllInvoices = async (
  userId: string,
  userRole: string,
  query: { search?: string; startDate?: string; endDate?: string }
) => {
  const where: any = {};

  // RBAC Filtering: Employee sees only their own created invoices
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"].includes(userRole);
  if (!isAdmin) {
    where.createdById = userId;
  }

  // Search Filter
  if (query.search) {
    const q = query.search.trim();
    where.OR = [
      { invoiceNumber: { contains: q, mode: "insensitive" } },
      { clientName: { contains: q, mode: "insensitive" } },
      { clientPhone: { contains: q, mode: "insensitive" } },
    ];
  }

  // Date Filter
  if (query.startDate || query.endDate) {
    where.invoiceDate = {};
    if (query.startDate) where.invoiceDate.gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      where.invoiceDate.lte = end;
    }
  }

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          employee: {
            select: {
              employeeId: true,
              designation: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return invoices;
};

const getInvoiceById = async (userId: string, userRole: string, id: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          employee: {
            select: {
              employeeId: true,
              designation: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"].includes(userRole);
  if (!isAdmin && invoice.createdById !== userId) {
    throw new Error("You do not have permission to view this invoice");
  }

  return invoice;
};

const updateInvoice = async (userId: string, userRole: string, id: string, payload: any) => {
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!existingInvoice) {
    throw new Error("Invoice not found");
  }

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"].includes(userRole);
  if (!isAdmin && existingInvoice.createdById !== userId) {
    throw new Error("You do not have permission to update this invoice");
  }

  const discount = payload.discount !== undefined ? Number(payload.discount) : existingInvoice.discount;
  const amountPaid = payload.amountPaid !== undefined ? Number(payload.amountPaid) : existingInvoice.amountPaid;

  let subTotal = existingInvoice.subTotal;

  // Transaction for updating items and invoice fields
  const updatedInvoice = await prisma.$transaction(async (tx) => {
    if (payload.items && Array.isArray(payload.items)) {
      // Delete existing line items
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // Create new line items
      const newItems = payload.items.map((item: any) => {
        const qty = Number(item.quantity) || 1;
        const rate = Number(item.rate) || 0;
        return {
          invoiceId: id,
          itemDescription: item.itemDescription,
          subDescription: item.subDescription || null,
          quantity: qty,
          rate: rate,
          amount: qty * rate,
        };
      });

      await tx.invoiceItem.createMany({
        data: newItems,
      });

      subTotal = newItems.reduce((acc: number, item: any) => acc + item.amount, 0);
    }

    const totalAmount = Math.max(0, subTotal - discount);
    const balanceDue = Math.max(0, totalAmount - amountPaid);

    const dueDate = payload.dueDate ? new Date(payload.dueDate) : existingInvoice.dueDate;

    return await tx.invoice.update({
      where: { id },
      data: {
        clientName: payload.clientName ?? existingInvoice.clientName,
        clientPhone: payload.clientPhone ?? existingInvoice.clientPhone,
        clientEmail: payload.clientEmail ?? existingInvoice.clientEmail,
        clientAddress: payload.clientAddress ?? existingInvoice.clientAddress,
        dueDate,
        paymentTerms: payload.paymentTerms ?? existingInvoice.paymentTerms,
        subTotal,
        discount,
        totalAmount,
        amountPaid,
        balanceDue,
        notes: payload.notes ?? existingInvoice.notes,
      },
      include: {
        items: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            employee: {
              select: {
                employeeId: true,
                designation: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  });

  return updatedInvoice;
};

const deleteInvoice = async (userRole: string, id: string) => {
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"].includes(userRole);
  if (!isAdmin) {
    throw new Error("Only administrators can delete invoices");
  }

  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Invoice not found");
  }

  await prisma.invoice.delete({ where: { id } });
  return { message: "Invoice deleted successfully" };
};

export const InvoiceService = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
