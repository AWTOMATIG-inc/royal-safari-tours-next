import { getBookingEnquiries } from "@/actions/bookingEnquiry";
import BookingEnquiryPage from "@/components/dashboard/booking-enquiry/BookingEnquiryPage";

export default async function BookingEnquiriesRoute({ searchParams }) {
  const { page, status, search } = (await searchParams) || {};
  const pageNum = page ? Number(page) : 1;
  const results = await getBookingEnquiries(pageNum, status || "", search || "");

  return (
    <div>
      <BookingEnquiryPage
        bookingEnquiries={results?.data || []}
        pagination={results?.pagination || { page: 1, totalPages: 1, total: 0 }}
        initialStatus={status || ""}
        initialSearch={search || ""}
      />
    </div>
  );
}
