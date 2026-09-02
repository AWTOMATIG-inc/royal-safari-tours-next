"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UsersPage({ users = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleOpenDeleteModal = (id, name, isSelf) => {
    if (isSelf) {
      return toast.error("You cannot delete your own account.");
    }
    setDeleteModal({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/users/${deleteModal.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to process user account");
      }
      toast.success(data.message || "User account processed successfully!");
      setDeleteModal({ open: false, id: null, name: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Delete user error");
      console.error("Delete user error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title="User Management"
        description="Manage registered customer accounts and monitor client memberships."
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Image
              src="/images/placeholders/empty_state.png"
              width={300}
              height={300}
              priority
              alt="Empty state"
              className="mx-auto opacity-80"
            />
            <p className="text-gray-500 font-medium font-inter text-base">
              No registered customer accounts found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Registered Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {users.map((userItem, idx) => {
                  const userId = userItem.id || `user-${idx}`;

                  const isSelf =
                    Boolean(currentUser) &&
                    ((currentUser?.id && userId === currentUser.id) ||
                      (currentUser?.email && userItem.email?.toLowerCase() === currentUser.email?.toLowerCase()));

                  return (
                    <tr key={userId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#0D231E]">
                        <div className="flex items-center gap-2">
                          <span>{userItem.name}</span>
                          {isSelf && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {userItem.email}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono">
                        {userItem.createdAt
                          ? new Date(userItem.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          disabled={isSelf}
                          onClick={() => handleOpenDeleteModal(userId, userItem.name, isSelf)}
                          className={`p-2 rounded-lg transition-colors ${
                            isSelf
                              ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed"
                              : "bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          }`}
                          title={isSelf ? "You cannot delete your own account" : "Delete customer account"}
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
                ? "/dashboard/users?page=1"
                : `/dashboard/users?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/users?page=${i + 1}`}
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
                ? `/dashboard/users?page=${pagination.totalPages}`
                : `/dashboard/users?page=${Number(pagination.page) + 1}`
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

      {/* Custom Confirmation Modal for User Deletion */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Customer Account"
        message={`Are you sure you want to delete ${deleteModal.name ? `"${deleteModal.name}"` : "this customer account"}?`}
        confirmText="Delete Account"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
