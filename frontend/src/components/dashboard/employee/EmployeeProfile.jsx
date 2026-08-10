"use client";

import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteEmployee } from "@/actions/employee";
import { getImageUrl } from "@/lib/getImageUrl";

export default function EmployeeProfile({ employee }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteEmployee(employee.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      setDeleteModal(false);
      return;
    }

    toast.success("Employee deleted successfully!");
    setDeleteModal(false);
    router.push("/dashboard/employees");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/employees"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1 mb-2"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            Back to Employees
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-heading">
            Employee Profile
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/employees/edit/${employee.id}`}
            className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#1a3a2f] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Icon icon="lucide:pencil" className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {employee.photo ? (
            <img
              src={getImageUrl(employee.photo)}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#2cb775]/10 flex items-center justify-center border-4 border-gray-100">
              <span className="text-[#2cb775] font-bold text-2xl">
                {employee.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-xl font-bold text-[#0D231E]">
                {employee.name}
              </h2>
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-fit">
                {employee.employeeId}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{employee.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Icon icon="lucide:building-2" className="w-4 h-4" />
                {employee.department?.name || "No Department"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Icon icon="lucide:badge" className="w-4 h-4" />
                {employee.designation?.name || "No Designation"}
              </span>
              <span className="text-gray-300">|</span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  employee.employmentStatus?.name === "Active"
                    ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                    : employee.employmentStatus?.name === "Inactive"
                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                    : employee.employmentStatus?.name === "Probation"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {employee.employmentStatus?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:user" className="w-4 h-4" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Full Name</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.email}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.phone || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Joining Date</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {formatDate(employee.joiningDate)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Reporting Manager</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.manager?.name || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:briefcase" className="w-4 h-4" />
            Employment Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Employee ID</span>
              <span className="text-sm font-mono font-semibold text-[#0D231E]">
                {employee.employeeId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Department</span>
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                {employee.department?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Designation</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.designation?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Employment Type</span>
              <span className="text-sm font-semibold text-[#0D231E]">
                {employee.employmentType?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Employment Status</span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  employee.employmentStatus?.name === "Active"
                    ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                    : employee.employmentStatus?.name === "Inactive"
                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {employee.employmentStatus?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon icon="lucide:file-text" className="w-4 h-4" />
          Documents
        </h3>
        {employee.documents && employee.documents.length > 0 ? (
          <div className="space-y-3">
            {employee.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon
                      icon={
                        doc.fileType?.includes("pdf")
                          ? "lucide:file-text"
                          : doc.fileType?.includes("image")
                          ? "lucide:image"
                          : "lucide:file"
                      }
                      className="w-5 h-5 text-blue-600"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0D231E]">
                      {doc.documentName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Icon icon="lucide:download" className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon
              icon="lucide:file-x"
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
            />
            <p className="text-sm">No documents uploaded yet.</p>
          </div>
        )}
      </div>

      {/* HR Notes Section */}
      {employee.hrNotes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:sticky-note" className="w-4 h-4" />
            HR Notes
          </h3>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-sm text-amber-800 whitespace-pre-wrap">
              {employee.hrNotes}
            </p>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}
