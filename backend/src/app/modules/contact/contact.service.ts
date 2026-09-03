import { prisma } from "../../utils/prisma";
import { ContactStatus } from "@prisma/client";
import {
  sendContactInquiryNotificationEmail,
  sendGuestInquiryConfirmationEmail,
} from "../auth/emailSender";

export const createContact = async (data: any) => {
  const contact = await prisma.contactInquiry.create({
    data: {
      name: data.name || "Anonymous",
      email: data.email || "",
      phone: data.phone || "N/A",
      message: data.message || "",
      destination: data.destination || null,
      travelDate: data.travelDate || null,
      guestCount: data.guestCount ? parseInt(data.guestCount) : 1,
      status: ContactStatus.PENDING,
      notes: data.notes || null,
    },
  });

  // Non-blocking async email notifications to admin and guest
  Promise.allSettled([
    sendContactInquiryNotificationEmail({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      destination: contact.destination,
      travelDate: contact.travelDate,
      guestCount: contact.guestCount,
      notes: contact.notes,
    }),
    contact.email && contact.email.includes("@")
      ? sendGuestInquiryConfirmationEmail(contact.email, contact.name, contact.destination, contact.travelDate, contact.guestCount)
      : Promise.resolve(false),
  ]).catch((err) => console.error("[Contact Email Background Error]:", err));

  return contact;
};

export const getAllContacts = async (query: { search?: string; status?: ContactStatus; page?: number; limit?: number }) => {
  const where: any = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { phone: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.status) {
    where.status = query.status;
  }

  const page = query.page || 1;
  const limit = query.limit || 50;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.contactInquiry.count({ where }),
    prisma.contactInquiry.findMany({
      where,
      skip,
      take: limit,
      include: { assignedTo: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data,
  };
};

export const getContactById = async (id: string) => {
  return await prisma.contactInquiry.findUnique({
    where: { id },
    include: { assignedTo: true },
  });
};

export const updateContactStatus = async (id: string, status: ContactStatus, notes?: string) => {
  return await prisma.contactInquiry.update({
    where: { id },
    data: { status, notes },
  });
};

export const deleteContact = async (id: string) => {
  return await prisma.contactInquiry.delete({
    where: { id },
  });
};
