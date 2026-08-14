"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import LeaveTypeModal from "./LeaveTypeModal";
import { deleteLeaveType } from "@/actions/leave";
import { useAuth } from "@/hooks/useAuth";

export default function LeaveTypesPage({ initialLeaveTypes = [] }) {
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");

  const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);

    const result = await deleteLeaveType(deleteModal.id);
    setDeleting(false);

    if (!result.success) {
      toast.error(result.message || "Failed to delete leave policy");
      setDeleteModal({ open: false, id: null });
      return;
    }

    toast.success("Leave policy deleted successfully!");
    setLeaveTypes((prev) => prev.filter((t) => t.id !== deleteModal.id));
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title="Leave Policies & Categories"
        description="Configure annual leave entitlements including Casual Leave, Sick Leave, and Paid Leave policies."
        actionText={canManage ? "Add Leave Policy" : undefined}
        actionOnClick={() => {
          setEditingType(null);
          setModalOpen(true);
        }}
      />

      {/* Leave Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {leaveTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 space-y-4 flex flex-col justify-between hover:border-gray-200 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775]">
                  <Icon icon="lucide:calendar" className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0D231E] text-white">
                  {type.defaultDaysPerYear} Days / Year
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0D231E] font-heading">
                  {type.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {type.description || "No specific policy guidelines set."}
                </p>
              </div>
            </div>

            {canManage && (
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setEditingType(type);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Edit Policy"
                >
                  <Icon icon="lucide:pencil" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: type.id })}
                  className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Policy"
                >
                  <Icon icon="lucide:trash-2" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {leaveTypes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-3">
          <Icon icon="lucide:calendar-off" className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">No Leave Policies Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click "Add Leave Policy" to configure Casual, Sick, or Paid leave categories.
          </p>
        </div>
      )}

      {/* Leave Policy Modal */}
      {canManage && (
        <LeaveTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          leaveType={editingType}
          onSuccess={() => window.location.reload()}
        />
      )}

      {/* Delete Confirm Modal */}
      {canManage && (
        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, id: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Leave Policy"
          message="Are you sure you want to delete this leave policy? This action cannot be undone."
          confirmText="Delete Policy"
          cancelText="Cancel"
          variant="danger"
          loading={deleting}
        />
      )}
    </div>
  );
}
