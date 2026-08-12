"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { updateLeaveApplicationStatus } from "@/actions/leave";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/hooks/useAuth";

export default function LeaveApplicationsPage({ initialApplications = [] }) {
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");
  const isEmployee = !authLoading && user?.role === "EMPLOYEE";

  const [applications, setApplications] = useState(initialApplications);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [reviewModal, setReviewModal] = useState({
    open: false,
    application: null,
    action: null, // "APPROVED" or "REJECTED"
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  const filteredApplications = applications.filter((app) => {
    const matchesTab = activeTab === "ALL" || app.status === activeTab;
    const matchesSearch =
      !searchTerm ||
      app.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employee?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.leaveType?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModal.application || !reviewModal.action) return;

    setSubmitting(true);
    const result = await updateLeaveApplicationStatus(reviewModal.application.id, {
      status: reviewModal.action,
      rejectionReason: reviewModal.action === "REJECTED" ? rejectionReason : undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message || "Failed to update application status");
      return;
    }

    toast.success(
      `Leave application ${reviewModal.action.toLowerCase()} successfully and leave balance updated!`
    );

    setApplications((prev) =>
      prev.map((a) => (a.id === reviewModal.application.id ? result.data : a))
    );

    setReviewModal({ open: false, application: null, action: null });
    setRejectionReason("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title={isEmployee ? "My Leave Applications" : "Leave Applications"}
        description={
          isEmployee
            ? "View your submitted leave requests, track approval status, and check leave balance."
            : "Review and approve staff leave applications, track pending requests, and manage leave balances."
        }
        actionText={isEmployee ? "Apply For Leave" : undefined}
        actionHref="/dashboard/my-profile"
      />

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {[
            { id: "ALL", label: "All Requests" },
            { id: "PENDING", label: "Pending", count: pendingCount },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#0D231E] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-amber-400 text-[#0D231E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee name or ID..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] transition-colors"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-inter">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Leave Type</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-center">Days</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6">Status</th>
                  {canManage && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {app.employee?.photo ? (
                          <img
                            src={getImageUrl(app.employee.photo)}
                            alt={app.employee.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775] font-bold text-xs">
                            {app.employee?.name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0D231E]">{app.employee?.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {app.employee?.employeeId} • {app.employee?.department?.name || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {app.leaveType?.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <p className="font-semibold text-[#0D231E]">
                        {formatDate(app.startDate)} - {formatDate(app.endDate)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Applied {formatDate(app.appliedAt)}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-bold text-[#0D231E] bg-gray-100 px-2.5 py-1 rounded-lg">
                        {app.totalDays}d
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={app.reason}>
                      {app.reason}
                      {app.rejectionReason && (
                        <span className="block text-[10px] text-rose-500 mt-0.5 truncate">
                          Rejection note: {app.rejectionReason}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
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
                    {canManage && (
                      <td className="py-4 px-6 text-right">
                        {app.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setReviewModal({
                                  open: true,
                                  application: app,
                                  action: "APPROVED",
                                })
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#2cb775] hover:bg-[#259b63] text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setReviewModal({
                                  open: true,
                                  application: app,
                                  action: "REJECTED",
                                })
                              }
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 p-8 space-y-3">
            <Icon icon="lucide:calendar-off" className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No Leave Applications</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No leave requests found matching the selected status or search filter.
            </p>
          </div>
        )}
      </div>

      {/* Review Action Modal (Admins Only) */}
      {canManage && reviewModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon
                  icon={
                    reviewModal.action === "APPROVED"
                      ? "lucide:check-circle-2"
                      : "lucide:x-circle"
                  }
                  className={`w-5 h-5 ${
                    reviewModal.action === "APPROVED" ? "text-[#2cb775]" : "text-rose-500"
                  }`}
                />
                {reviewModal.action === "APPROVED"
                  ? "Approve Leave Application"
                  : "Reject Leave Application"}
              </h3>
              <button
                onClick={() =>
                  setReviewModal({ open: false, application: null, action: null })
                }
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to {reviewModal.action?.toLowerCase()} the{" "}
              <span className="font-bold text-[#0D231E]">
                {reviewModal.application?.leaveType?.name}
              </span>{" "}
              request for{" "}
              <span className="font-bold text-[#0D231E]">
                {reviewModal.application?.employee?.name}
              </span>{" "}
              ({reviewModal.application?.totalDays} days)?
            </p>

            {reviewModal.action === "APPROVED" && (
              <p className="text-xs text-[#2cb775] font-semibold bg-[#2cb775]/10 p-3 rounded-xl">
                ✓ Approving this request will automatically deduct {reviewModal.application?.totalDays} days from the employee's {reviewModal.application?.leaveType?.name} balance.
              </p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {reviewModal.action === "REJECTED" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rejection Reason / Remarks
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a brief explanation for rejecting this request..."
                    className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setReviewModal({ open: false, application: null, action: null })
                  }
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-xs cursor-pointer ${
                    reviewModal.action === "APPROVED"
                      ? "bg-[#2cb775] hover:bg-[#259b63]"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {submitting ? "Processing..." : `Confirm ${reviewModal.action}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
