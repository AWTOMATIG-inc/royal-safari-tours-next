"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useMemo } from "react";
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
  // Navigation view mode: "JOBS" (all jobs showcase) or "APPLICANTS" (job-specific applicants portal)
  const [activeView, setActiveView] = useState("JOBS");

  // Selected Job for Applicant Management
  const [selectedJob, setSelectedJob] = useState(null);

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
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Candidate Details & Q&A Modal
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

  const fetchApplications = async (jobId = "") => {
    setAppsLoading(true);
    const res = await getAdminJobApplications({
      jobPostId: jobId,
      status: filterStatus,
      search: filterSearch,
    });
    setAppsLoading(false);
    if (res.success) {
      setApplications(res.data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (activeView === "APPLICANTS" && selectedJob) {
      fetchApplications(selectedJob.id);
    }
  }, [activeView, selectedJob, filterStatus]);

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setFilterStatus("");
    setFilterSearch("");
    setActiveView("APPLICANTS");
    fetchApplications(job.id);
  };

  const handleBackToJobs = () => {
    setActiveView("JOBS");
    setSelectedJob(null);
    fetchJobs();
  };

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
      toast.error(res.message || "Failed to update candidate status");
      return;
    }

    toast.success("Candidate status updated successfully!");
    setStatusModal(false);
    setSelectedApp(null);

    // Refresh active list
    if (selectedJob) {
      fetchApplications(selectedJob.id);
    } else {
      fetchApplications();
    }
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => !j.isExpired && j.isPublished).length;
    const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
    const expiredJobs = jobs.filter((j) => j.isExpired).length;

    return { totalJobs, activeJobs, totalApplicants, expiredJobs };
  }, [jobs]);

  // Applicant Status Counts for selected job
  const appStats = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter((a) => a.status === "SUBMITTED").length;
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
    const interviewed = applications.filter((a) => a.status === "INTERVIEW_SCHEDULED").length;
    const hired = applications.filter((a) => a.status === "HIRED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;

    return { total, submitted, shortlisted, interviewed, hired, rejected };
  }, [applications]);

  // Candidate Q&A Array helper
  const candidateAnswers = useMemo(() => {
    if (!selectedApp || !selectedApp.answers) return [];
    if (Array.isArray(selectedApp.answers)) return selectedApp.answers;
    if (typeof selectedApp.answers === "string") {
      try {
        return JSON.parse(selectedApp.answers);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [selectedApp]);

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-body">
      {/* VIEW 1: Main Job Openings Showcase */}
      {activeView === "JOBS" && (
        <div className="space-y-6 font-body">
          {/* Header */}
          <DashboardPageHeader
            title="Recruitment & Job Openings"
            description="Post job openings, configure custom screening questions, and access job-specific candidate application portals."
            actionText="Post New Job Opening"
            onAction={() => {
              setSelectedJobForEdit(null);
              setJobModal(true);
            }}
          />

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-body">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2cb775] flex items-center justify-center shrink-0">
                <Icon icon="lucide:briefcase" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">Total Positions</span>
                <strong className="text-lg font-bold text-[#0D231E] font-heading">{metrics.totalJobs}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">Active Openings</span>
                <strong className="text-lg font-bold text-[#0D231E] font-heading">{metrics.activeJobs}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Icon icon="lucide:users" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">Total Candidates</span>
                <strong className="text-lg font-bold text-[#0D231E] font-heading">{metrics.totalApplicants}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Icon icon="lucide:clock" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">Expired Positions</span>
                <strong className="text-lg font-bold text-[#0D231E] font-heading">{metrics.expiredJobs}</strong>
              </div>
            </div>
          </div>

          {/* Job Openings Table View */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden font-body">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between font-body">
              <h3 className="text-sm font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:layers" className="w-4 h-4 text-secondary" />
                Active Job Vacancies & Applicant Portals
              </h3>
              <span className="text-xs text-gray-500 font-body">
                Click <strong>"View Applications"</strong> on any job row to manage candidates.
              </span>
            </div>

            {jobsLoading ? (
              <div className="text-center py-16 text-xs text-gray-400 font-body">Loading job postings...</div>
            ) : jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-body">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-4 px-6">Job Position Title</th>
                      <th className="py-4 px-6">Location & Work Mode</th>
                      <th className="py-4 px-6 text-center">Vacancies</th>
                      <th className="py-4 px-6">Deadline Date</th>
                      <th className="py-4 px-6 text-center">Applicant Portal</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-body">
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
                          <button
                            onClick={() => handleViewApplicants(job)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white font-bold text-xs cursor-pointer shadow-xs transition-all duration-300"
                          >
                            <Icon icon="lucide:users" className="w-4 h-4 text-secondary" />
                            <span>View Applications ({job.applicationsCount || 0})</span>
                            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          {job.isExpired ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                              Expired
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
                              title="Copy direct shareable link"
                            >
                              <Icon icon="lucide:share-2" className="w-4 h-4" />
                            </button>
                            <a
                              href={`/jobs/${job.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors cursor-pointer"
                              title="Preview public job page"
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
              <div className="text-center py-16 p-8 space-y-3 font-body">
                <Icon icon="lucide:briefcase" className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-700">No Job Openings Posted Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click "Post New Job Opening" above to create your first vacancy posting.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Dedicated Job-Specific Applicant Portal */}
      {activeView === "APPLICANTS" && selectedJob && (
        <div className="space-y-6 font-body animate-in fade-in duration-200">
          {/* Top Breadcrumb & Job Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-body">
            <button
              onClick={handleBackToJobs}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-2xs w-fit"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4 text-secondary" />
              <span>Back to All Job Positions</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyShareLink(selectedJob.slug)}
                className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-secondary transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="lucide:share-2" className="w-3.5 h-3.5 text-secondary" />
                <span>Share Job Link</span>
              </button>
              <a
                href={`/jobs/${selectedJob.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0D231E] text-white text-xs font-semibold hover:bg-[#2cb775] transition-colors flex items-center gap-1.5"
              >
                <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
                <span>Public Page</span>
              </a>
            </div>
          </div>

          {/* Job Info Banner Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_25px_rgba(13,35,30,0.04)] space-y-4 font-body">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-secondary block font-body">
                  JOB SPECIFIC APPLICANT PORTAL
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D231E] font-heading">
                  {selectedJob.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 font-body">
                  <span>📍 {selectedJob.location}</span>
                  <span>•</span>
                  <span>{selectedJob.jobType} ({selectedJob.workMode})</span>
                  <span>•</span>
                  <span>Deadline: {formatDateStr(selectedJob.deadline)}</span>
                </div>
              </div>

              {selectedJob.isExpired ? (
                <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 w-fit">
                  Applications Expired
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-[#2cb775]/10 text-[#2cb775] text-xs font-bold border border-[#2cb775]/20 w-fit">
                  Active Hiring
                </span>
              )}
            </div>

            {/* Applicant Status Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-body">
              <button
                onClick={() => setFilterStatus("")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === ""
                    ? "bg-[#0D231E] text-white border-[#0D231E]"
                    : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">All Applicants</span>
                <strong className="text-base font-bold font-heading">{appStats.total}</strong>
              </button>

              <button
                onClick={() => setFilterStatus("SUBMITTED")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === "SUBMITTED"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50/50 border-blue-100 text-blue-800 hover:bg-blue-100/50"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">Submitted</span>
                <strong className="text-base font-bold font-heading">{appStats.submitted}</strong>
              </button>

              <button
                onClick={() => setFilterStatus("SHORTLISTED")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === "SHORTLISTED"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50/50 border-amber-100 text-amber-800 hover:bg-amber-100/50"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">Shortlisted</span>
                <strong className="text-base font-bold font-heading">{appStats.shortlisted}</strong>
              </button>

              <button
                onClick={() => setFilterStatus("INTERVIEW_SCHEDULED")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === "INTERVIEW_SCHEDULED"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-purple-50/50 border-purple-100 text-purple-800 hover:bg-purple-100/50"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">Interview</span>
                <strong className="text-base font-bold font-heading">{appStats.interviewed}</strong>
              </button>

              <button
                onClick={() => setFilterStatus("HIRED")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === "HIRED"
                    ? "bg-[#2cb775] text-white border-[#2cb775]"
                    : "bg-emerald-50/50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">Hired</span>
                <strong className="text-base font-bold font-heading">{appStats.hired}</strong>
              </button>

              <button
                onClick={() => setFilterStatus("REJECTED")}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  filterStatus === "REJECTED"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50/50 border-rose-100 text-rose-800 hover:bg-rose-100/50"
                }`}
              >
                <span className="text-[10px] font-semibold block uppercase">Rejected</span>
                <strong className="text-base font-bold font-heading">{appStats.rejected}</strong>
              </button>
            </div>
          </div>

          {/* Search Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4 font-body">
            <div className="relative w-full sm:w-96 font-body">
              <Icon
                icon="lucide:search"
                className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchApplications(selectedJob.id)}
                placeholder="Search candidate by name, email, or phone..."
                className="w-full bg-sand border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary font-body"
              />
              {filterSearch && (
                <button
                  onClick={() => {
                    setFilterSearch("");
                    fetchApplications(selectedJob.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              )}
            </div>

            <span className="text-xs text-gray-500 font-body">
              Showing <strong className="text-primary font-bold">{applications.length}</strong> candidates
            </span>
          </div>

          {/* Candidate Applications Grid/Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden font-body">
            {appsLoading ? (
              <div className="text-center py-16 text-xs text-gray-400 font-body">Loading candidate applications...</div>
            ) : applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-body">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-4 px-6">Candidate Profile</th>
                      <th className="py-4 px-6">Experience & Salary</th>
                      <th className="py-4 px-6">Applied Date</th>
                      <th className="py-4 px-6">Resume File</th>
                      <th className="py-4 px-6">Current Status</th>
                      <th className="py-4 px-6 text-right">Shortlist & Q&A Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-body">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="space-y-0.5 font-body">
                            <p className="font-bold text-[#0D231E] text-sm">{app.applicantName}</p>
                            <p className="text-[11px] text-gray-500 font-mono">{app.applicantEmail}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{app.applicantPhone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-body">
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-gray-700">
                              Exp: {app.experienceYears || "N/A"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Expected: {app.expectedSalary || "N/A"}
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors shadow-2xs"
                            >
                              <Icon icon="lucide:file-text" className="w-3.5 h-3.5" />
                              <span>View Resume</span>
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
                                : app.status === "INTERVIEW_SCHEDULED"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all duration-300 shadow-xs cursor-pointer"
                          >
                            <Icon icon="lucide:user-check" className="w-3.5 h-3.5 text-secondary" />
                            <span>Review & Q&A Answers</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 p-8 space-y-3 font-body">
                <Icon icon="lucide:users" className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-700">No Candidates Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  No applicants have submitted forms matching this status filter yet.
                </p>
              </div>
            )}
          </div>
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

      {/* Modal: Detailed Candidate Profile, Q&A Responses & Status Management */}
      {statusModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 font-body max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 font-body">
              <div>
                <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
                  <Icon icon="lucide:user-check" className="w-5 h-5 text-[#2cb775]" />
                  Candidate Profile & Screening Q&A
                </h3>
                <p className="text-xs text-gray-500">
                  Applied Position: <strong className="text-primary font-semibold">{selectedApp.jobPost?.title || selectedJob?.title || "—"}</strong>
                </p>
              </div>
              <button
                onClick={() => setStatusModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Quick Details Card */}
            <div className="p-4 rounded-2xl bg-sand/70 border border-gray-200 space-y-3 font-body">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-3 font-body">
                <div>
                  <h4 className="text-sm font-bold text-[#0D231E]">{selectedApp.applicantName}</h4>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">{selectedApp.applicantEmail} • {selectedApp.applicantPhone}</p>
                </div>
                {selectedApp.resumeUrl && (
                  <a
                    href={getImageUrl(selectedApp.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                  >
                    <Icon icon="lucide:file-text" className="w-4 h-4" />
                    <span>Download CV / Resume</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body">
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Experience</span>
                  <strong className="text-primary font-bold">{selectedApp.experienceYears || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Expected Salary</span>
                  <strong className="text-primary font-bold">{selectedApp.expectedSalary || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-semibold">Current Employer</span>
                  <strong className="text-primary font-bold">{selectedApp.currentCompany || "N/A"}</strong>
                </div>
              </div>
            </div>

            {/* Candidate Custom Q&A Answers Section */}
            <div className="space-y-3 font-body">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 font-heading">
                <Icon icon="lucide:message-square-code" className="w-4 h-4 text-secondary" />
                Custom Questionnaire Responses ({candidateAnswers.length})
              </h4>

              {candidateAnswers.length > 0 ? (
                <div className="space-y-2.5 font-body">
                  {candidateAnswers.map((ans, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1 font-body">
                      <p className="text-xs font-bold text-[#0D231E] font-body">
                        Q{idx + 1}: {ans.questionText}
                      </p>
                      <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200/80 font-body leading-relaxed">
                        {ans.answerText || <span className="text-gray-400 italic">No response provided</span>}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                  No custom screening questions were configured for this job post.
                </p>
              )}
            </div>

            {/* Cover Letter */}
            {selectedApp.coverLetter && (
              <div className="space-y-1.5 font-body">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon icon="lucide:mail" className="w-4 h-4 text-secondary" />
                  Candidate Note / Cover Letter
                </h4>
                <p className="text-xs text-gray-600 bg-sand/60 p-3 rounded-xl border border-gray-200 leading-relaxed font-body">
                  "{selectedApp.coverLetter}"
                </p>
              </div>
            )}

            {/* Status Update & HR Notes Form */}
            <form onSubmit={handleStatusSubmit} className="space-y-4 pt-3 border-t border-gray-100 font-body">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Candidate Shortlist Status *
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] font-body"
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
                  rows={3}
                  value={statusForm.hrNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, hrNotes: e.target.value })}
                  placeholder="Record interview notes, salary negotiation, candidate evaluation..."
                  className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775] font-body"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 font-body">
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
                  className="bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {statusSubmitting ? "Saving..." : "Save Candidate Status"}
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
