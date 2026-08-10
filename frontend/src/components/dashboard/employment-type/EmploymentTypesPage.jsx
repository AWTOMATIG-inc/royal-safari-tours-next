"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteEmploymentType } from "@/actions/employmentType";
import EmploymentTypeModal from "./EmploymentTypeModal";

export default function EmploymentTypesPage({ employmentTypes = [] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setLoading(true);
    const result = await deleteEmploymentType(deleteModal.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      setDeleteModal({ open: false, id: null });
      return;
    }

    toast.success("Employment type deleted successfully!");
    setDeleteModal({ open: false, id: null });
    router.refresh();
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingType(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingType(null);
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Employment Types"
        description="Manage employment classifications and contract types."
        actionText="Add Employment Type"
        actionHref="/dashboard/employment-types/create"
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {employmentTypes.length === 0 ? (
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
              No employment types found. Click above to create your first
              employment type.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Employees</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {employmentTypes.map((type) => (
                  <tr
                    key={type.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-[#0D231E]">
                      {type.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20">
                        {type._count?.employees || 0} employees
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit employment type"
                        >
                          <Icon icon="lucide:pencil" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, id: type.id })
                          }
                          className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete employment type"
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

      {showModal && (
        <EmploymentTypeModal
          employmentType={editingType}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Employment Type"
        message="Are you sure you want to delete this employment type? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}
