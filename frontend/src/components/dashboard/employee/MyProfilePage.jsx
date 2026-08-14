"use client";

import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  updateEmployeeSelfProfile,
  uploadEmployeeDocument,
  deleteEmployeeDocument,
} from "@/actions/employee";
import {
  getMyLeaveBalances,
  getMyLeaveApplications,
  applyLeave,
} from "@/actions/leave";
import { getImageUrl } from "@/lib/getImageUrl";
import { changePassword } from "@/lib/auth";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import AttendanceWidget from "@/components/dashboard/attendance/AttendanceWidget";

const DOCUMENT_PRESETS = [
  "National ID (NID)",
  "Passport",
  "Academic Certificate",
  "Driving License",
  "Employment Contract",
  "Other",
];

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function MyProfilePage({ employee, error }) {
  // Profile Edit Modal States
  const [editModal, setEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState(employee?.name || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [phone, setPhone] = useState(employee?.phone || "");
  const [photoPreview, setPhotoPreview] = useState(
    employee?.photo ? getImageUrl(employee.photo) : null
  );
  const [photoFile, setPhotoFile] = useState(null);

  // Document Upload Modal States
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  // Document Delete States
  const [deleteDocModal, setDeleteDocModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(false);

  // Leave Management States
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loadingLeaveData, setLoadingLeaveData] = useState(true);

  // Apply Leave Modal States
  const [applyModal, setApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Password Change Modal States
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const docFileInputRef = useRef(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setPasswordSubmitting(true);
    const result = await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswordSubmitting(false);

    if (!result.success) {
      toast.error(result.message || "Current password is incorrect");
      return;
    }

    toast.success("Password updated successfully!");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordModal(false);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchLeaveData = async () => {
    setLoadingLeaveData(true);
    const [balRes, appRes] = await Promise.all([
      getMyLeaveBalances(),
      getMyLeaveApplications(),
    ]);

    if (balRes.success) setLeaveBalances(balRes.data);
    if (appRes.success) setLeaveApplications(appRes.data);
    setLoadingLeaveData(false);
  };

  useEffect(() => {
    if (employee) {
      fetchLeaveData();
    }
  }, [employee?.id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be less than 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const result = await updateEmployeeSelfProfile(formData);
    setUpdating(false);

    if (!result.success) {
      toast.error(result.message || "Failed to update profile");
      return;
    }

    toast.success("Profile updated successfully!");
    setEditModal(false);
    window.location.reload();
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Document size must be less than 10MB");
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
    window.location.reload();
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
    window.location.reload();
  };

  const handleApplyLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.leaveTypeId || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error("Please fill in all required leave fields");
      return;
    }

    setApplying(true);
    const result = await applyLeave(leaveForm);
    setApplying(false);

    if (!result.success) {
      toast.error(result.message || "Failed to submit leave request");
      return;
    }

    toast.success("Leave application submitted successfully!");
    setApplyModal(false);
    setLeaveForm({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
    fetchLeaveData();
  };

  if (error || !employee) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl text-center space-y-4 font-body">
        <Icon icon="lucide:user-x" className="w-16 h-16 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-[#0D231E] font-heading">
          Employee Profile Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {error || "Your user account is not linked to an employee profile. Please contact HR or System Administrator."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-heading">
            My Employee Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
            View and manage your personal employee details, leave balances, and official documents.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPasswordModal(true)}
            className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#163a32] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:key-round" className="w-4 h-4 text-[#2cb775]" />
            Change Password
          </button>
          <button
            onClick={() => setEditModal(true)}
            className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:pencil" className="w-4 h-4" />
            Edit Info
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
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-xs"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#2cb775]/10 flex items-center justify-center border-4 border-gray-100">
              <span className="text-[#2cb775] font-bold text-2xl">
                {getInitials(employee.name)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-xl font-bold text-[#0D231E] font-heading">
                {employee.name}
              </h2>
              <span className="font-mono text-xs text-[#2cb775] bg-[#2cb775]/10 px-2.5 py-1 rounded-lg inline-fit font-bold">
                {employee.employeeId}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{employee.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Icon icon="lucide:building-2" className="w-4 h-4 text-[#2cb775]" />
                {employee.department?.name || "No Department"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
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
                {employee.employmentStatus?.name || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Check-In / Check-Out Widget */}
      <AttendanceWidget />

      {/* Leave Balances & Apply Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="lucide:calendar-check" className="w-4 h-4 text-[#2cb775]" />
              Annual Leave Balances ({new Date().getFullYear()})
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Your leave entitlements, usage, and available balances.
            </p>
          </div>
          <button
            onClick={() => setApplyModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#0D231E] hover:bg-[#1a3a2f] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Apply For Leave
          </button>
        </div>

        {/* Leave Balance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leaveBalances.map((bal) => {
            const available = Math.max(0, bal.totalDays - bal.usedDays);
            const percentage = Math.min(100, Math.round((bal.usedDays / bal.totalDays) * 100));

            return (
              <div
                key={bal.id}
                className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0D231E] font-heading">
                    {bal.leaveType?.name}
                  </span>
                  <span className="text-xs font-bold text-[#2cb775] bg-[#2cb775]/10 px-2 py-0.5 rounded-lg">
                    {available} Days Left
                  </span>
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

        {/* Leave Application History */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            My Leave Request History
          </h4>

          {leaveApplications.length > 0 ? (
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
                  {leaveApplications.map((app) => (
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
              No leave requests submitted yet. Click "Apply For Leave" to submit a request.
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:user" className="w-4 h-4 text-[#2cb775]" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Full Name</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Email Address</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.email}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Phone Number</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.phone || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Joining Date</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {formatDate(employee.joiningDate)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Reporting Manager</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.manager?.name || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Employment Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon icon="lucide:briefcase" className="w-4 h-4 text-[#2cb775]" />
            Employment Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Staff ID</span>
              <span className="text-sm font-mono font-semibold text-[#0D231E] truncate">
                {employee.employeeId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Department</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium truncate">
                {employee.department?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Designation</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.designation?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Employment Type</span>
              <span className="text-sm font-semibold text-[#0D231E] truncate">
                {employee.employmentType?.name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 gap-2">
              <span className="text-sm text-gray-500 shrink-0">Status</span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  employee.employmentStatus?.name === "Active"
                    ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {employee.employmentStatus?.name || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section (Fully Responsive) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 flex-wrap">
            <Icon icon="lucide:file-text" className="w-4 h-4 text-[#2cb775] shrink-0" />
            <span>My Documents (NID, Passport, Certificates)</span>
            {employee.documents && employee.documents.length > 0 && (
              <span className="bg-[#2cb775]/10 text-[#2cb775] text-xs px-2 py-0.5 rounded-full font-bold">
                {employee.documents.length}
              </span>
            )}
          </h3>
          <button
            onClick={() => setUploadModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#2cb775] hover:bg-[#259b63] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {employee.documents && employee.documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {employee.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors w-full min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
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
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs sm:text-sm font-semibold text-[#0D231E] truncate max-w-[150px] sm:max-w-[220px] md:max-w-[170px] lg:max-w-xs"
                      title={doc.documentName}
                    >
                      {doc.documentName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
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
          <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 px-4">
            <Icon
              icon="lucide:folder-open"
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
            />
            <p className="text-sm font-semibold text-gray-700">
              No documents uploaded yet
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Upload your National ID (NID), Passport, Certificates, or Contracts to keep your employee record complete.
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

      {/* Edit Profile Info Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:user-cog" className="w-5 h-5 text-[#2cb775]" />
                Edit Personal Info
              </h3>
              <button
                onClick={() => setEditModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdateSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775] font-bold text-lg">
                      {getInitials(name)}
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload-input"
                    />
                    <label
                      htmlFor="photo-upload-input"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
                    >
                      <Icon icon="lucide:upload" className="w-3.5 h-3.5" />
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
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

      {/* Apply For Leave Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:calendar-plus" className="w-5 h-5 text-[#2cb775]" />
                Apply For Leave
              </h3>
              <button
                onClick={() => setApplyModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
              {/* Leave Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Leave Type Category *
                </label>
                <select
                  required
                  value={leaveForm.leaveTypeId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveTypeId: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
                >
                  <option value="">-- Select Leave Category --</option>
                  {leaveBalances.map((bal) => {
                    const rem = bal.totalDays - bal.usedDays;
                    const isExhausted = rem <= 0;
                    return (
                      <option key={bal.id} value={bal.leaveTypeId} disabled={isExhausted}>
                        {bal.leaveType?.name}{" "}
                        {isExhausted
                          ? "(Exhausted - 0 days remaining)"
                          : `(${rem} days remaining)`}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                  />
                </div>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="State the reason for taking leave..."
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setApplyModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  {applying ? (
                    <>
                      <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:key-round" className="w-5 h-5 text-[#2cb775]" />
                Change Account Password
              </h3>
              <button
                onClick={() => setPasswordModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    placeholder="Enter your current password"
                    className="w-full border border-gray-300 p-3 pr-10 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password (Min 6 characters) *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  min={6}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  min={6}
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPasswordModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#2cb775] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
