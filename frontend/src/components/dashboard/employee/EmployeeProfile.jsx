"use client";

import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteEmployee,
  uploadEmployeeDocument,
  deleteEmployeeDocument,
} from "@/actions/employee";
import { updateEmployeeLeaveBalance } from "@/actions/leave";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/hooks/useAuth";

const DOCUMENT_PRESETS = [
  "National ID (NID)",
  "Passport",
  "Academic Certificate",
  "Driving License",
  "Employment Contract",
  "Other",
];

export default function EmployeeProfile({ employee }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Document Upload Modal States
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  // Document Delete States
  const [deleteDocModal, setDeleteDocModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(false);

  // Edit Leave Balance Modal States
  const [editBalanceModal, setEditBalanceModal] = useState({
    open: false,
    balance: null,
  });
  const [totalDaysInput, setTotalDaysInput] = useState(10);
  const [updatingBalance, setUpdatingBalance] = useState(false);

  const docFileInputRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const handleDocumentFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setDocumentFile(file);
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      toast.error("Please select a document file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", documentFile);
    formData.append("documentName", documentName || documentFile.name);

    const result = await uploadEmployeeDocument(employee.id, formData);
    setUploading(false);

    if (!result.success) {
      toast.error(result.message || "Failed to upload document");
      return;
    }

    toast.success("Document uploaded successfully!");
    setDocumentFile(null);
    setDocumentName("");
    if (docFileInputRef.current) docFileInputRef.current.value = "";
    setUploadModal(false);
    router.refresh();
  };

  const handleDeleteDocConfirm = async () => {
    if (!selectedDocId) return;
    setDeletingDoc(true);
    const result = await deleteEmployeeDocument(selectedDocId, employee.id);
    setDeletingDoc(false);

    if (!result.success) {
      toast.error(result.message || "Failed to delete document");
      setDeleteDocModal(false);
      return;
    }

    toast.success("Document deleted successfully!");
    setDeleteDocModal(false);
    setSelectedDocId(null);
    router.refresh();
  };

  const handleEditBalanceSubmit = async (e) => {
    e.preventDefault();
    if (!editBalanceModal.balance) return;

    setUpdatingBalance(true);
    const result = await updateEmployeeLeaveBalance(editBalanceModal.balance.id, {
      totalDays: Number(totalDaysInput),
    });
    setUpdatingBalance(false);

    if (!result.success) {
      toast.error(result.message || "Failed to update leave balance");
      return;
    }

    toast.success("Employee leave balance allocation updated successfully!");
    setEditBalanceModal({ open: false, balance: null });
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-body">
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
        {canManage && (
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
        )}
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {employee.photo ? (
            <img
              src={getImageUrl(employee.photo)}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-xs"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#2cb775]/10 flex items-center justify-center border-4 border-gray-100 text-[#2cb775] font-bold text-2xl">
              {employee.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D231E] font-heading">
                {employee.name}
              </h2>
              <span className="font-mono text-xs text-[#2cb775] bg-[#2cb775]/10 px-2.5 py-1 rounded-lg font-bold">
                {employee.employeeId}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{employee.email}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <Icon icon="lucide:building-2" className="w-4 h-4 text-[#2cb775]" />
                {employee.department?.name || "No Department"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <Icon icon="lucide:badge" className="w-4 h-4 text-[#2cb775]" />
                {employee.designation?.name || "No Designation"}
              </span>
              <span className="text-gray-300">|</span>
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:user" className="w-4 h-4" />
            Personal Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Phone Number</span>
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

        {/* Employment Information Card */}
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

      {/* Leave Balances & Leave Applications History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="lucide:calendar-check" className="w-4 h-4 text-[#2cb775]" />
            Leave Balances & Entitlements ({new Date().getFullYear()})
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Current year leave allocation and usage status for this employee.
          </p>
        </div>

        {/* Leave Balance Cards */}
        {employee.leaveBalances && employee.leaveBalances.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {employee.leaveBalances.map((bal) => {
              const available = Math.max(0, bal.totalDays - bal.usedDays);
              const percentage = Math.min(100, Math.round((bal.usedDays / bal.totalDays) * 100));

              return (
                <div
                  key={bal.id}
                  className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0D231E] font-heading">
                      {bal.leaveType?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2cb775] bg-[#2cb775]/10 px-2 py-0.5 rounded-lg">
                        {available} Days Left
                      </span>
                      {canManage && (
                        <button
                          onClick={() => {
                            setEditBalanceModal({ open: true, balance: bal });
                            setTotalDaysInput(bal.totalDays);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded-md transition-colors"
                          title="Edit Total Days"
                        >
                          <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-gray-500">
                    <span>Used: <strong className="text-gray-700">{bal.usedDays}</strong> / {bal.totalDays} Days</span>
                    <span className="font-mono text-[11px] font-semibold">{percentage}% Used</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        percentage > 80
                          ? "bg-rose-500"
                          : percentage > 50
                          ? "bg-amber-400"
                          : "bg-[#2cb775]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No leave balance records generated yet.</p>
        )}

        {/* Leave Request History Table */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Leave Request History
          </h4>

          {employee.leaveApplications && employee.leaveApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-inter">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold">
                    <th className="py-3 px-4 rounded-l-xl">Leave Type</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4 text-center">Days</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {employee.leaveApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-[#0D231E]">
                        {app.leaveType?.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {formatDate(app.startDate)} - {formatDate(app.endDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#0D231E]">
                        {app.totalDays}d
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate" title={app.reason}>
                        {app.reason}
                        {app.rejectionReason && (
                          <span className="block text-[10px] text-rose-500 mt-0.5">
                            Note: {app.rejectionReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            app.status === "APPROVED"
                              ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                              : app.status === "REJECTED"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-3 italic">
              No leave requests submitted by this employee yet.
            </p>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="lucide:file-text" className="w-4 h-4 text-[#2cb775]" />
            Employee Documents
            {employee.documents && employee.documents.length > 0 && (
              <span className="bg-[#2cb775]/10 text-[#2cb775] text-xs px-2 py-0.5 rounded-full font-bold">
                {employee.documents.length}
              </span>
            )}
          </h3>
          {canManage && (
            <button
              onClick={() => setUploadModal(true)}
              className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Upload Document
            </button>
          )}
        </div>

        {employee.documents && employee.documents.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {employee.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-lg bg-[#2cb775]/10 flex items-center justify-center shrink-0">
                    <Icon
                      icon={
                        doc.fileType?.includes("pdf")
                          ? "lucide:file-text"
                          : doc.fileType?.includes("image")
                          ? "lucide:image"
                          : "lucide:file-check"
                      }
                      className="w-5 h-5 text-[#2cb775]"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D231E] truncate">
                      {doc.documentName}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={getImageUrl(doc.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="View / Download Document"
                  >
                    <Icon icon="lucide:download" className="w-4 h-4" />
                  </a>
                  {canManage && (
                    <button
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setDeleteDocModal(true);
                      }}
                      className="p-2 rounded-lg bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Icon
              icon="lucide:folder-open"
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
            />
            <p className="text-sm font-semibold text-gray-700">
              No employee documents uploaded yet
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Upload NID, Passport, Academic Certificates, or Employment Contracts for this staff member.
            </p>
            {canManage && (
              <button
                onClick={() => setUploadModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
              >
                <Icon icon="lucide:upload" className="w-4 h-4" />
                Upload First Document
              </button>
            )}
          </div>
        )}
      </div>

      {/* HR Notes Section */}
      {canManage && employee.hrNotes && (
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

      {/* Upload Document Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:upload-cloud" className="w-5 h-5 text-[#2cb775]" />
                Upload Employee Document
              </h3>
              <button
                onClick={() => setUploadModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocumentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Document Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOCUMENT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDocumentName(preset === "Other" ? "" : preset)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        documentName === preset
                          ? "bg-[#2cb775] text-white border-[#2cb775]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Document Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="e.g. National ID Card (NID) / Passport Copy"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select File (PDF, PNG, JPG, DOCX - Max 10MB) *
                </label>
                <input
                  type="file"
                  ref={docFileInputRef}
                  required
                  onChange={handleDocumentFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2cb775]/10 file:text-[#2cb775] hover:file:bg-[#2cb775]/20 cursor-pointer"
                />
                {documentFile && (
                  <p className="text-xs text-[#2cb775] font-semibold mt-1.5 flex items-center gap-1 truncate">
                    <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Selected: {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Leave Balance Modal */}
      {canManage && editBalanceModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:pencil" className="w-5 h-5 text-[#2cb775]" />
                Edit Leave Entitlement ({editBalanceModal.balance?.leaveType?.name})
              </h3>
              <button
                onClick={() => setEditBalanceModal({ open: false, balance: null })}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditBalanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Allocated Total Days Per Year *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={365}
                  value={totalDaysInput}
                  onChange={(e) => setTotalDaysInput(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditBalanceModal({ open: false, balance: null })}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingBalance}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2cb775] hover:bg-[#259b63] transition-all shadow-xs cursor-pointer"
                >
                  {updatingBalance ? "Saving..." : "Update Balance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Employee Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Employee Profile"
        message="Are you sure you want to delete this employee profile? This action cannot be undone."
        confirmText="Delete Profile"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />

      {/* Delete Document Modal */}
      <ConfirmModal
        isOpen={deleteDocModal}
        onClose={() => {
          setDeleteDocModal(false);
          setSelectedDocId(null);
        }}
        onConfirm={handleDeleteDocConfirm}
        title="Delete Document"
        message="Are you sure you want to delete this document? The physical file will be removed permanently."
        confirmText="Delete Document"
        cancelText="Cancel"
        variant="danger"
        loading={deletingDoc}
      />
    </div>
  );
}
