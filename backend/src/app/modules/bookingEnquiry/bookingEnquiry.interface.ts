import { BookingStatus } from "@prisma/client";

export interface ICreateBookingEnquiryInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation?: string;
  travelDate?: string;
  guestCount?: number;
  specialNotes?: string;
  totalAmount?: number;
  packageId?: string;
  packageName: string;
}

export interface IBookingEnquiryQueryFilters {
  search?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface IUpdateBookingEnquiryInput {
  status?: BookingStatus;
  adminNotes?: string;
}
