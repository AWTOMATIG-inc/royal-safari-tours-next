"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import JobPostModal from "./JobPostModal";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import {
  getAdminJobs,
  deleteJobPost,
  getAdminJobApplications,
  updateJobApplicationStatus,
} from "@/actions/recruitment";
import { getImageUrl } from "@/lib/getImageUrl";

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState("JOBS"); // "JOBS" or "APPLICATIONS"

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [jobModal, setJobModal] = useState(false);

  // Delete state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [filterJobId, setFilterJobId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Application Details / Status Update Modal
  const [statusModal, setStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "SUBMITTED", hrNotes: "" });
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const fetchJobs = async () => {
    setJobsLoading(true);
    const res = await getAdminJobs();
    setJobsLoading(false);
    if (res.success) {
      setJobs(res.data);
    }
  };

  const fetchApplications = async () => {
    setAppsLoading(true);
    const res = await getAdminJobApplications({
      jobPostId: filterJobId,
      status: filterStatus,
      search: filterSearch,
    });
    setAppsLoading(false);
    if (res.success) {
      setApplications(res.data);
    }
  };

  useEffect(() => {
    if (activeTab === "JOBS") {
      fetchJobs();
    } else {
      fetchApplications();
    }
  }, [activeTab, filterJobId, filterStatus]);

  const handleCopyShareLink = (slug) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/jobs/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Job shareable link copied to clipboard!");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingJobId) return;
    setDeleting(true);
    const res = await deleteJobPost(deletingJobId);
    setDeleting(false);

    if (!res.success) {
      toast.error(res.message || "Failed to delete job post");
      return;
    }

    toast.success("Job post deleted successfully!");
    setDeleteModal(false);
    setDeletingJobId(null);
    fetchJobs();
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setStatusSubmitting(true);
    const res = await updateJobApplicationStatus(selectedApp.id, statusForm);
    setStatusSubmitting(false);

    if (!res.success) {
      toast.error(res.message || "Failed to update status");
      return;
    }

    toast.success("Application status updated!");
    setStatusModal(false);
    setSelectedApp(null);
    fetchApplications();
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title="Recruitment & Job Openings"
        description="Publish job openings with deadlines, copy shareable public links, and manage candidate submissions."
        actionText="Post New Job"
        actionIcon="lucide:plus"
        onActionClick={() => {
          setSelectedJobForEdit(null);
          setJobModal(true);
        }}
      />

      {/* Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("JOBS")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "JOBS"
                ? "bg-[#0D231E] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon icon="lucide:briefcase" className="w-4 h-4 text-[#2cb775]" />
            Job Openings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "APPLICATIONS"
                ? "bg-[#0D231E] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon icon="lucide:users" className="w-4 h-4 text-[#2cb775]" />
            Candidate Applications ({applications.length})
          </button>
        </div>

        {activeTab === "APPLICATIONS" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2cb775]"
            >
              <option value="">All Job Posts</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2cb775]"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <div className="relative">
              <Icon
                icon="lucide:search"
                className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchApplications()}
                placeholder="Search candidates..."
                className="bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#2cb775] w-36 sm:w-44"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Job Openings Table */}
      {activeTab === "JOBS" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
          {jobsLoading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading job postings...</div>
          ) : jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-inter">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-4 px-6">Job Position</th>
                    <th className="py-4 px-6">Location & Mode</th>
                    <th className="py-4 px-6 text-center">Vacancies</th>
                    <th className="py-4 px-6">Deadline</th>
                    <th className="py-4 px-6 text-center">Applicants</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#0D231E] text-sm">{job.title}</p>
                          <span className="text-[11px] text-gray-400 font-mono inline-block">
                            /{job.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-700">{job.location}</p>
                          <div className="flex gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold">
                              {job.jobType}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                              {job.workMode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-[#0D231E]">
                        {job.vacancies}
                      </td>
                      <td className="py-4 px-6 font-mono">
                        {formatDateStr(job.deadline)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#2cb775]/10 text-[#2cb775] font-bold text-xs">
                          {job.applicationsCount} Applicants
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {job.isExpired ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                            Deadline Expired
                          </span>
                        ) : job.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyShareLink(job.slug)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#2cb775]/10 hover:text-[#2cb775] text-gray-600 transition-colors cursor-pointer"
                            title="Copy shareable direct URL link"
                          >
                            <Icon icon="lucide:share-2" className="w-4 h-4" />
                          </button>
                          <a
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors cursor-pointer"
                            title="Preview public job details page"
                          >
                            <Icon icon="lucide:external-link" className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => {
                              setSelectedJobForEdit(job);
                              setJobModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-50 hover:text-amber-600 text-gray-600 transition-colors cursor-pointer"
                            title="Edit job opening"
                          >
                            <Icon icon="lucide:pencil" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingJobId(job.id);
                              setDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 transition-colors cursor-pointer"
                            title="Delete job opening"
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
          ) : (
            <div className="text-center py-12 p-8 space-y-3">
              <Icon icon="lucide:briefcase" className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-700">No Job Openings Posted</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Create a new job posting to start receiving applicant resumes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Candidate Applications Table */}
      {activeTab === "APPLICATIONS" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
          {appsLoading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading applicant records...</div>
          ) : applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-inter">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Applied Position</th>
                    <th className="py-4 px-6">Experience & Salary</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Resume / CV</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#0D231E]">{app.applicantName}</p>
                          <p className="text-[11px] text-gray-500 font-mono">{app.applicantEmail}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{app.applicantPhone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800">
                          {app.jobPost?.title || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-gray-700">
                            Exp: {app.experienceYears || "—"}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Expected: {app.expectedSalary || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono">{formatDateStr(app.appliedAt)}</td>
                      <td className="py-4 px-6">
                        {app.resumeUrl ? (
                          <a
                            href={getImageUrl(app.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                          >
                            <Icon icon="lucide:file-text" className="w-3.5 h-3.5" />
                            View Resume
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No File</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            app.status === "SHORTLISTED"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : app.status === "HIRED"
                              ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                              : app.status === "REJECTED"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setStatusForm({
                              status: app.status,
                              hrNotes: app.hrNotes || "",
                            });
                            setStatusModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0D231E] hover:bg-[#1a3a2f] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Icon icon="lucide:user-check" className="w-3.5 h-3.5 text-[#2cb775]" />
                          Manage Candidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 p-8 space-y-3">
              <Icon icon="lucide:users" className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-700">No Candidate Applications Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No application records submitted yet for this filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Job Post Creation/Edit */}
      <JobPostModal
        isOpen={jobModal}
        onClose={() => {
          setJobModal(false);
          setSelectedJobForEdit(null);
        }}
        job={selectedJobForEdit}
        onSuccess={fetchJobs}
      />

      {/* Modal: Candidate Status & HR Notes */}
      {statusModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
                  <Icon icon="lucide:user-check" className="w-5 h-5 text-[#2cb775]" />
                  Manage Application Status
                </h3>
                <p className="text-xs text-gray-500">{selectedApp.applicantName} ({selectedApp.applicantEmail})</p>
              </div>
              <button
                onClick={() => setStatusModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Candidate Status *
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  HR Internal Notes / Interview Feedback
                </label>
                <textarea
                  rows={4}
                  value={statusForm.hrNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, hrNotes: e.target.value })}
                  placeholder="Record interview notes, salary discussion, candidate evaluation..."
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStatusModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusSubmitting}
                  className="bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {statusSubmitting ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeletingJobId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Opening"
        message="Are you sure you want to delete this job opening? All submitted candidate applications for this post will also be deleted permanently."
        confirmText="Delete Job Post"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
