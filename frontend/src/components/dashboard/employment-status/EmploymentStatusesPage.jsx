"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteEmploymentStatus } from "@/actions/employmentStatus";
import { useAuth } from "@/hooks/useAuth";
import EmploymentStatusModal from "./EmploymentStatusModal";

export default function EmploymentStatusesPage({ employmentStatuses = [] }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");

  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setLoading(true);
    const result = await deleteEmploymentStatus(deleteModal.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      setDeleteModal({ open: false, id: null });
      return;
    }

    toast.success("Employment status deleted successfully!");
    setDeleteModal({ open: false, id: null });
    router.refresh();
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingStatus(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingStatus(null);
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Employment Statuses"
        description="View employment status categories and conditions."
        actionText={canManage ? "Add Employment Status" : undefined}
        actionHref="/dashboard/employment-statuses/create"
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {employmentStatuses.length === 0 ? (
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
              No employment statuses found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Employees</th>
                  {canManage && <th className="py-4 px-6 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {employmentStatuses.map((status) => (
                  <tr
                    key={status.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-[#0D231E]">
                      {status.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {status.description || "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {status._count?.employees || 0} employees
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(status)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit employment status"
                          >
                            <Icon icon="lucide:pencil" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ open: true, id: status.id })
                            }
                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete employment status"
                          >
                            <Icon icon="lucide:trash-2" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canManage && showModal && (
        <EmploymentStatusModal
          employmentStatus={editingStatus}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {canManage && (
        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Employment Status"
          message="Are you sure you want to delete this employment status? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={loading}
        />
      )}
    </div>
  );
}
