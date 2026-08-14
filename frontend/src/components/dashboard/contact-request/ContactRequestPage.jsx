"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ContactRequestPage({ contactRequests = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
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
    <div className="max-w-7xl mx-auto space-y-6">
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
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Message</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {contactRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0D231E]">
                      {req.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {req.email}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-mono">
                      {req.phone || "—"}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-gray-600" title={req.message}>
                      {req.message}
                    </td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete request"
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              key={i}
              href={`/dashboard/contact-requests?page=${i + 1}`}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold font-inter transition-all ${
                pagination.page.toString() === (i + 1).toString()
                  ? "bg-[#0D231E] border-[#0D231E] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
