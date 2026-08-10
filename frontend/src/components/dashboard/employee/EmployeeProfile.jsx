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
import { getImageUrl } from "@/lib/getImageUrl";

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
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Document Upload Modal States
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const fileInputRef = useRef(null);

  // Document Delete States
  const [deleteDocModal, setDeleteDocModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(false);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          <button
            onClick={() => setUploadModal(true)}
            className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Upload Document
          </button>
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
            <button
              onClick={() => setUploadModal(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Icon icon="lucide:upload" className="w-4 h-4" />
              Upload First Document
            </button>
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
              {/* Document Preset Quick Selection */}
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

              {/* Custom Document Name Input */}
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

              {/* File Upload Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select File (PDF, PNG, JPG, DOCX - Max 10MB) *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  required
                  onChange={handleDocumentFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2cb775]/10 file:text-[#2cb775] hover:file:bg-[#2cb775]/20 cursor-pointer"
                />
                {documentFile && (
                  <p className="text-xs text-[#2cb775] font-semibold mt-1.5 flex items-center gap-1">
                    <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5" />
                    Selected: {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
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
                  {uploading ? (
                    <>
                      <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:upload" className="w-4 h-4" />
                      Upload Document
                    </>
                  )}
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
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
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
        message="Are you sure you want to delete this employee document? The physical file will be removed permanently."
        confirmText="Delete Document"
        cancelText="Cancel"
        variant="danger"
        loading={deletingDoc}
      />
    </div>
  );
}
