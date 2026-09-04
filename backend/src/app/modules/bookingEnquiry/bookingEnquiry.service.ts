import { prisma } from "../../utils/prisma";
import { BookingStatus } from "@prisma/client";
import {
  ICreateBookingEnquiryInput,
  IBookingEnquiryQueryFilters,
  IUpdateBookingEnquiryInput,
} from "./bookingEnquiry.interface";
import {
  sendCustomerBookingReceiptEmail,
  sendAdminBookingNotificationEmail,
} from "../auth/emailSender";

// Helper to generate a unique readable booking ID (e.g. RST-BK-2026-984210)
function generateBookingId(): string {
  const currentYear = new Date().getFullYear();
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `RST-BK-${currentYear}-${randomSixDigits}`;
}

export const createBookingEnquiryService = async (payload: ICreateBookingEnquiryInput) => {
  const bookingId = generateBookingId();

  const booking = await prisma.bookingEnquiry.create({
    data: {
      bookingId,
      customerName: payload.customerName || "Valued Traveler",
      customerEmail: payload.customerEmail || "",
      customerPhone: payload.customerPhone || "N/A",
      pickupLocation: payload.pickupLocation || null,
      travelDate: payload.travelDate || null,
      guestCount: payload.guestCount ? Number(payload.guestCount) : 1,
      specialNotes: payload.specialNotes || null,
      totalAmount: payload.totalAmount ? Number(payload.totalAmount) : null,
      packageId: payload.packageId || null,
      packageName: payload.packageName || "Tour Package",
      status: BookingStatus.PENDING,
    },
    include: {
      package: true,
    },
  });

  // Non-blocking async email notifications to customer and admin
  Promise.allSettled([
    sendAdminBookingNotificationEmail({
      bookingId: booking.bookingId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      packageName: booking.packageName,
      travelDate: booking.travelDate,
      guestCount: booking.guestCount,
      totalAmount: booking.totalAmount ? Number(booking.totalAmount) : null,
      pickupLocation: booking.pickupLocation,
      specialNotes: booking.specialNotes,
    }),
    booking.customerEmail && booking.customerEmail.includes("@")
      ? sendCustomerBookingReceiptEmail({
          bookingId: booking.bookingId,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          packageName: booking.packageName,
          travelDate: booking.travelDate,
          guestCount: booking.guestCount,
          totalAmount: booking.totalAmount ? Number(booking.totalAmount) : null,
          pickupLocation: booking.pickupLocation,
          specialNotes: booking.specialNotes,
        })
      : Promise.resolve(false),
  ]).catch((err) => console.error("[Booking Email Dispatch Async Error]:", err));

  return booking;
};

export const getAllBookingEnquiriesService = async (query: IBookingEnquiryQueryFilters) => {
  const where: any = {};

  if (query.search) {
    const q = query.search.trim();
    where.OR = [
      { bookingId: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
      { packageName: { contains: q, mode: "insensitive" } },
      { pickupLocation: { contains: q, mode: "insensitive" } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.bookingEnquiry.count({ where }),
    prisma.bookingEnquiry.findMany({
      where,
      skip,
      take: limit,
      include: {
        package: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data,
  };
};

export const getBookingEnquiryByIdService = async (id: string) => {
  return await prisma.bookingEnquiry.findUnique({
    where: { id },
    include: {
      package: true,
    },
  });
};

export const updateBookingEnquiryService = async (id: string, payload: IUpdateBookingEnquiryInput) => {
  const dataToUpdate: any = {};
  if (payload.status) dataToUpdate.status = payload.status;
  if (payload.adminNotes !== undefined) dataToUpdate.adminNotes = payload.adminNotes;

  return await prisma.bookingEnquiry.update({
    where: { id },
    data: dataToUpdate,
    include: {
      package: true,
    },
  });
};

export const deleteBookingEnquiryService = async (id: string) => {
  return await prisma.bookingEnquiry.delete({
    where: { id },
  });
};
