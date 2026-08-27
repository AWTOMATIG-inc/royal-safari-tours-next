"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactRequestPage({ contactRequests = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [selectedReq, setSelectedReq] = useState(null);

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this contact request?");
    if (!userConfirmed) return;
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Contact request deleted successfully!");
      if (selectedReq?._id === id) setSelectedReq(null);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
      console.error("Delete operation error:", error);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        body: formData,
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

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Contact Requests"
        description="Review, update status, and respond to incoming expedition inquiries and custom trip plans."
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {contactRequests.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Image
              src="/images/dashboard/empty.png"
              width={300}
              height={300}
              priority
              alt="Empty state"
              className="mx-auto opacity-80"
            />
            <p className="text-gray-500 font-medium font-inter text-base">
              No contact requests received yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
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
                {contactRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
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
                        onChange={(e) => handleStatus(req._id, e.target.value)}
                        defaultValue={req.status || "pending"}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#0D231E] focus:outline-none focus:border-[#2cb775] cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
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
                          onClick={() => handleDelete(req._id)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete request"
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

      {/* View Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-[#0D231E] font-bold text-lg font-inter">
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

            <div className="grid grid-cols-2 gap-4 text-xs font-inter">
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
              <p className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed font-inter">
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
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={
              isPrev
                ? "/dashboard/contact-requests?page=1"
                : `/dashboard/contact-requests?page=${Number(pagination.page) - 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
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
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold font-inter transition-all ${
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
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
              isNext
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
