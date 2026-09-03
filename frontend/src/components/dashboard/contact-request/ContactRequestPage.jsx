"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactRequestPage({ contactRequests = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [selectedReq, setSelectedReq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleOpenDeleteModal = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contact/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Contact request deleted successfully!");
      if (selectedReq?.id === deleteModal.id) {
        setSelectedReq(null);
      }
      setDeleteModal({ open: false, id: null, name: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message);
      console.error("Delete operation error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        return toast.error("Failed to update status");
      }
      router.refresh();
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.message);
    }
  };

  const filteredRequests = contactRequests.filter((req) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (req.name || "").toLowerCase();
    const email = (req.email || "").toLowerCase();
    const phone = (req.phone || "").toLowerCase();
    const destination = (req.destination || "").toLowerCase();
    const message = (req.message || "").toLowerCase();
    const date = (req.date || "").toLowerCase();
    const status = (req.status || "").toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      destination.includes(q) ||
      message.includes(q) ||
      date.includes(q) ||
      status.includes(q)
    );
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Contact Requests"
        description="Review, update status, and respond to incoming expedition inquiries and custom trip plans."
      />

      {/* Independent Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Icon
            icon="lucide:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by name, email, phone..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
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

        {searchQuery && (
          <div className="text-xs text-gray-500 font-medium self-start sm:self-center">
            Found <span className="font-bold text-[#0D231E]">{filteredRequests.length}</span> matching inquiry(s)
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {contactRequests.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Image
              src="/images/placeholders/empty_state.png"
              width={300}
              height={300}
              priority
              alt="Empty state"
              className="mx-auto opacity-80"
            />
            <p className="text-gray-500 font-medium text-base">
              No contact requests received yet.
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Icon icon="lucide:search-x" className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium text-base">
              No contact inquiries match &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Phone</th>
                  <th className="py-4 px-5">Destination</th>
                  <th className="py-4 px-5">Travel Date</th>
                  <th className="py-4 px-5">People</th>
                  <th className="py-4 px-5">Message</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredRequests.map((req, idx) => {
                  const reqId = req.id || `req-${idx}`;
                  return (
                    <tr key={reqId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#0D231E] whitespace-nowrap">
                        {req.name}
                      </td>
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                        {req.email}
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-mono whitespace-nowrap">
                        {req.phone || "—"}
                      </td>
                      <td className="py-4 px-5 font-medium text-[#2cb775] whitespace-nowrap">
                        {req.destination || "—"}
                      </td>
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap font-mono">
                        {req.date || "—"}
                      </td>
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap font-semibold">
                        {req.people ? `${req.people} Person(s)` : "—"}
                      </td>
                      <td className="py-4 px-5 max-w-[180px] truncate text-gray-600" title={req.message}>
                        {req.message}
                      </td>
                      <td className="py-4 px-5">
                        <select
                          onChange={(e) => handleStatus(reqId, e.target.value)}
                          defaultValue={req.status || "New"}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#0D231E] focus:outline-none focus:border-[#2cb775] cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-[#2cb775]/10 hover:text-[#2cb775] transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Icon icon="lucide:eye" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(reqId, req.name)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete request"
                          >
                            <Icon icon="lucide:trash-2" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-[#0D231E] font-bold text-lg">
                <Icon icon="lucide:mail-check" className="w-5 h-5 text-[#2cb775]" />
                <span>Inquiry Details</span>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Full Name</span>
                <span className="font-bold text-gray-800 text-sm">{selectedReq.name}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Email Address</span>
                <span className="font-semibold text-gray-700">{selectedReq.email}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Phone Number</span>
                <span className="font-mono font-semibold text-gray-700">{selectedReq.phone || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Destination</span>
                <span className="font-bold text-[#2cb775]">{selectedReq.destination || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Travel Date</span>
                <span className="font-mono font-semibold text-gray-700">{selectedReq.date || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Number of People</span>
                <span className="font-semibold text-gray-700">{selectedReq.people ? `${selectedReq.people} Person(s)` : "—"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <span className="text-gray-400 font-medium text-xs block">Customer Message</span>
              <p className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed">
                {selectedReq.message}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2.5 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && !searchQuery && (
        <div className="flex justify-center items-center gap-2 pt-4 font-inter">
          <Link
            href={
              isPrev
                ? "/dashboard/contact-requests?page=1"
                : `/dashboard/contact-requests?page=${Number(pagination.page) - 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              isPrev
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/dashboard/contact-requests?page=${i + 1}`}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                Number(pagination.page) === i + 1
                  ? "bg-[#0D231E] text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </Link>
          ))}

          <Link
            href={
              isNext
                ? `/dashboard/contact-requests?page=${pagination.totalPages}`
                : `/dashboard/contact-requests?page=${Number(pagination.page) + 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              isNext
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Next
          </Link>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Contact Request"
        message={`Are you sure you want to delete ${deleteModal.name ? `inquiry from "${deleteModal.name}"` : "this contact request"}? This action cannot be undone.`}
        confirmText="Delete Request"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
