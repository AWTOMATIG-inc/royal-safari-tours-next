"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "PROCESSING", label: "Processing", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "CONFIRMED", label: "Confirmed", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "CANCELLED", label: "Cancelled", bg: "bg-rose-50 text-rose-700 border-rose-200" },
  { value: "COMPLETED", label: "Completed", bg: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function BookingEnquiryPage({
  bookingEnquiries = [],
  pagination = { page: 1, totalPages: 1 },
  initialStatus = "",
  initialSearch = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, bookingId: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const isPrev = Number(pagination.page) <= 1;
  const isNext = Number(pagination.page) >= pagination.totalPages;

  const handleOpenDeleteModal = (id, bookingId) => {
    setDeleteModal({ open: true, id, bookingId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/booking-enquiry/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete booking enquiry");

      toast.success("Booking enquiry deleted successfully!");
      if (selectedBooking?.id === deleteModal.id) {
        setSelectedBooking(null);
      }
      setDeleteModal({ open: false, id: null, bookingId: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message);
      console.error("Delete operation error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/booking-enquiry/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        return toast.error("Failed to update status");
      }
      toast.success(`Booking status updated to ${newStatus}`);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      router.refresh();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.message);
    }
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedBooking) return;
    setIsSavingNotes(true);
    try {
      const response = await fetch(`/api/booking-enquiry/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: adminNotesInput }),
      });

      if (!response.ok) throw new Error("Failed to save admin notes");

      toast.success("Admin notes saved successfully");
      setSelectedBooking({ ...selectedBooking, adminNotes: adminNotesInput });
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Error saving notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setAdminNotesInput(booking.adminNotes || "");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard!`);
  };

  const filteredEnquiries = bookingEnquiries.filter((item) => {
    if (activeStatus && item.status !== activeStatus) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const bId = (item.bookingId || "").toLowerCase();
    const name = (item.customerName || "").toLowerCase();
    const email = (item.customerEmail || "").toLowerCase();
    const phone = (item.customerPhone || "").toLowerCase();
    const pkg = (item.packageName || "").toLowerCase();
    const pickup = (item.pickupLocation || "").toLowerCase();
    return (
      bId.includes(q) ||
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      pkg.includes(q) ||
      pickup.includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "COMPLETED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Booking Enquiries"
        description="Monitor traveler package reservations, manage booking status updates, and review full customer itinerary details."
      />

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <button
            onClick={() => setActiveStatus("")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              !activeStatus
                ? "bg-[#0D231E] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Statuses
          </button>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveStatus(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStatus === opt.value
                  ? "bg-[#0D231E] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Icon
            icon="lucide:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, customer, tour..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {bookingEnquiries.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Icon icon="lucide:calendar-x2" className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium text-base">
              No booking enquiries received yet.
            </p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Icon icon="lucide:search-x" className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium text-base">
              No booking enquiries match your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveStatus("");
              }}
              className="px-4 py-2 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-5">Booking ID</th>
                  <th className="py-4 px-5">Customer Name</th>
                  <th className="py-4 px-5">Tour Package / Service</th>
                  <th className="py-4 px-5">Travel Date</th>
                  <th className="py-4 px-5">Booking Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredEnquiries.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* 1. Booking ID */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <button
                        onClick={() => copyToClipboard(req.bookingId)}
                        className="group flex items-center gap-1.5 font-mono font-bold text-xs text-[#0D231E] bg-gray-100 hover:bg-[#2cb775]/10 hover:text-[#2cb775] px-2.5 py-1 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title="Click to copy Booking ID"
                      >
                        <span>{req.bookingId}</span>
                        <Icon icon="lucide:copy" className="w-3 h-3 text-gray-400 group-hover:text-[#2cb775]" />
                      </button>
                    </td>

                    {/* 2. Customer Name & Contact Info */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-bold text-[#0D231E]">{req.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{req.customerPhone}</span>
                        <span>&bull;</span>
                        <span className="truncate max-w-[150px]">{req.customerEmail}</span>
                      </div>
                    </td>

                    {/* 3. Tour Package / Service */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-bold text-[#2cb775] truncate max-w-[200px]">
                        {req.packageName}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        {req.guestCount ? `${req.guestCount} Guest(s)` : "1 Guest"}{" "}
                        {req.totalAmount ? `(৳${Number(req.totalAmount).toLocaleString()})` : ""}
                      </div>
                    </td>

                    {/* 4. Travel Date */}
                    <td className="py-4 px-5 whitespace-nowrap font-mono text-gray-700">
                      {req.travelDate || "Flexible"}
                    </td>

                    {/* 5. Booking Status Dropdown */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <select
                        value={req.status || "PENDING"}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className={`border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${getStatusBadge(req.status)}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 6. Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetails(req)}
                          className="px-3 py-1.5 rounded-lg bg-[#0D231E] text-white hover:bg-[#2cb775] transition-colors font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="View Details"
                        >
                          <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(req.id, req.bookingId)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete booking"
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0D231E]">
                  Booking Enquiry Details
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span>Booking :</span>
                    <button
                      onClick={() => copyToClipboard(selectedBooking.bookingId)}
                      className="font-mono font-bold text-[#0D231E] bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Click to copy Booking ID"
                    >
                      <span>{selectedBooking.bookingId}</span>
                      <Icon icon="lucide:copy" className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span>Booking Status :</span>
                    <span className={`px-2.5 py-0.5 border rounded-md text-xs font-bold ${getStatusBadge(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                CUSTOMER DETAILS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Full Name</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Phone / WhatsApp</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-emerald-600">{selectedBooking.customerPhone}</span>
                    {selectedBooking.customerPhone && (
                      <a
                        href={`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <Icon icon="akar-icons:whatsapp-fill" className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Email Address</span>
                  <a href={`mailto:${selectedBooking.customerEmail}`} className="font-semibold text-gray-800 underline">
                    {selectedBooking.customerEmail || "N/A"}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Pickup Point / Hotel</span>
                  <span className="font-semibold text-gray-800">{selectedBooking.pickupLocation || "Standard Meeting Location"}</span>
                </div>
              </div>
            </div>

            {/* Package Details Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                PACKAGE DETAILS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Package Name</span>
                  <Link
                    href={
                      selectedBooking.package?.slug
                        ? `/packages/${selectedBooking.package.slug}`
                        : selectedBooking.packageId
                        ? `/packages/${selectedBooking.packageId}`
                        : `/adventure`
                    }
                    target="_blank"
                    className="font-bold text-[#2cb775] hover:text-[#0D231E] hover:underline text-sm inline-flex items-center gap-1 transition-colors mt-0.5"
                    title="View package details"
                  >
                    <span>{selectedBooking.packageName}</span>
                    <Icon icon="lucide:external-link" className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </Link>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Travel Date</span>
                  <span className="font-mono font-bold text-gray-800">{selectedBooking.travelDate || "Flexible"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Tour Duration</span>
                  <span className="font-semibold text-gray-800">
                    {selectedBooking.package?.duration || "Standard Expedition"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Number of Persons / Total Guests</span>
                  <span className="font-bold text-gray-900">
                    {selectedBooking.guestCount} Person(s){" "}
                    {selectedBooking.totalAmount ? `(৳${Number(selectedBooking.totalAmount).toLocaleString()})` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Notes / Requests */}
            {selectedBooking.specialNotes && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                  Customer Special Requests
                </span>
                <p className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium">
                  {selectedBooking.specialNotes}
                </p>
              </div>
            )}

            {/* Admin Notes Section */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Internal Staff & Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Enter internal staff notes, payment details, guide assignment..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAdminNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-60"
                >
                  {isSavingNotes ? (
                    <Icon icon="lucide:loader-2" className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Icon icon="lucide:save" className="w-3.5 h-3.5" />
                  )}
                  <span>Save Internal Notes</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-[11px] text-gray-400 font-mono">
                Created: {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, bookingId: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Booking Enquiry"
        message={`Are you sure you want to delete Booking ID "${deleteModal.bookingId}"? This action cannot be undone.`}
        confirmText="Delete Booking"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
