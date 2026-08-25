"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SubscribersPage({ subscribers = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, email: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleOpenDeleteModal = (id, email) => {
    setDeleteModal({ open: true, id, email });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/subscriber/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete subscriber");
      }
      toast.success("Subscriber deleted successfully!");
      setDeleteModal({ open: false, id: null, email: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete subscriber");
      console.error("Delete subscriber error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Journal Subscribers"
        description="View and manage subscribed email addresses for luxury travel dispatches."
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {subscribers.length === 0 ? (
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
              No newsletter subscribers yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">SL</th>
                  <th className="py-4 px-6">Subscribed Email</th>
                  <th className="py-4 px-6">Subscription Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {subscribers.map((item, idx) => {
                  const subId = item._id || item.id;
                  const sl = (pagination.page - 1) * 10 + idx + 1;

                  return (
                    <tr key={subId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-400">
                        #{sl}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#0D231E]">
                        {item.email}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenDeleteModal(subId, item.email)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete subscriber"
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                ? "/dashboard/subscribers?page=1"
                : `/dashboard/subscribers?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/subscribers?page=${i + 1}`}
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
                ? `/dashboard/subscribers?page=${pagination.totalPages}`
                : `/dashboard/subscribers?page=${Number(pagination.page) + 1}`
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

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, email: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Subscriber"
        message={`Are you sure you want to remove ${deleteModal.email ? `"${deleteModal.email}"` : "this subscriber"} from the journal dispatch list?`}
        confirmText="Delete Subscriber"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
