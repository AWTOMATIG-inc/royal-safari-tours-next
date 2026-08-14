"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getPublicJobBySlug, submitJobApplication } from "@/actions/recruitment";

export default function PublicJobDetailPage({ slug }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    experienceYears: "2 Years",
    currentCompany: "",
    expectedSalary: "",
    coverLetter: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const res = await getPublicJobBySlug(slug);
      setLoading(false);
      if (res.success) {
        setJob(res.data);
      } else {
        setError(res.message || "Job position not found");
      }
    };
    fetchJob();
  }, [slug]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Resume file size must be less than 20MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job position link copied to clipboard!");
    }
  };

  const scrollToApply = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your Resume / CV (PDF, DOC, DOCX)");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("applicantName", form.applicantName);
    formData.append("applicantEmail", form.applicantEmail);
    formData.append("applicantPhone", form.applicantPhone);
    formData.append("experienceYears", form.experienceYears);
    formData.append("currentCompany", form.currentCompany);
    formData.append("expectedSalary", form.expectedSalary);
    formData.append("coverLetter", form.coverLetter);

    const res = await submitJobApplication(slug, formData);
    setSubmitting(false);

    if (!res.success) {
      toast.error(res.message || "Failed to submit application");
      return;
    }

    setSuccessModal(true);
    setForm({
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      experienceYears: "2 Years",
      currentCompany: "",
      expectedSalary: "",
      coverLetter: "",
    });
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 text-xs text-gray-400 font-body">
        Loading job posting details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-center space-y-4 font-body pt-32">
        <Icon icon="lucide:file-x" className="w-16 h-16 text-rose-400" />
        <h2 className="text-xl font-bold text-gray-800 font-heading">Job Position Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          The job position you are looking for may have been removed or the URL link is invalid.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-[#0D231E] text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Back to Careers Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-body text-[#0D231E] pb-24">
      {/* Top Header Hero (Increased top padding pt-28 sm:pt-36 to accommodate floating main Navbar) */}
      <div className="bg-[#0D231E] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 border-b border-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-xs text-[#2cb775] hover:underline font-semibold"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              Back to All Job Openings
            </Link>

            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              <Icon icon="lucide:share-2" className="w-3.5 h-3.5 text-[#2cb775]" />
              Share Job Position
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {job.isExpired ? (
                  <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                    Deadline Expired
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                    Accepting Applications
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white leading-tight">
                {job.title}
              </h1>

              {/* Clean Subtitle (Removed duplicate Location & Deadline text) */}
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Icon icon="lucide:building-2" className="w-4 h-4 text-[#2cb775]" />
                <span className="font-semibold text-white">Royal Safari Tours Ltd.</span>
                <span>•</span>
                <span>Career Opportunity</span>
              </div>
            </div>

            {!job.isExpired && (
              <div className="shrink-0">
                <button
                  onClick={scrollToApply}
                  className="bg-[#2cb775] hover:bg-[#239660] text-white text-xs font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <span>Apply Now</span>
                  <Icon icon="lucide:arrow-down" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2cb775]/10 blur-3xl" />
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Specs & Job Details (7 Cols / 60% Width) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Consolidated 6-Metric Highlights Grid (3x2 on Desktop, 2x3 on Mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
              {/* Spec 1: Job Type */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center shrink-0">
                  <Icon icon="lucide:briefcase" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Job Type
                  </span>
                  <p className="text-xs font-bold text-[#0D231E] font-heading truncate">
                    {job.jobType}
                  </p>
                </div>
              </div>

              {/* Spec 2: Work Mode */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:laptop" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Work Mode
                  </span>
                  <p className="text-xs font-bold text-[#0D231E] font-heading truncate">
                    {job.workMode}
                  </p>
                </div>
              </div>

              {/* Spec 3: Vacancies */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:users" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Vacancies
                  </span>
                  <p className="text-xs font-bold text-[#0D231E] font-heading truncate">
                    {job.vacancies} Positions
                  </p>
                </div>
              </div>

              {/* Spec 4: Office Hours */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:clock" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Office Hours
                  </span>
                  <p className="text-xs font-bold text-[#0D231E] font-mono truncate">
                    {job.officeTime || "Standard"}
                  </p>
                </div>
              </div>

              {/* Spec 5: Location */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:map-pin" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Location
                  </span>
                  <p className="text-xs font-bold text-[#0D231E] truncate">
                    {job.location}
                  </p>
                </div>
              </div>

              {/* Spec 6: Application Deadline */}
              <div className="bg-gray-50/70 rounded-2xl p-3 sm:p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:calendar" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Deadline
                  </span>
                  <p className="text-xs font-bold text-amber-700 font-mono truncate">
                    {formatDateStr(job.deadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Overview Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-[#0D231E] font-heading border-b border-gray-100 pb-3 flex items-center gap-2">
                <Icon icon="lucide:info" className="w-5 h-5 text-[#2cb775]" />
                Job Overview & Position Summary
              </h2>
              <div
                className="rich-text-content text-gray-700 leading-relaxed text-xs"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Job Responsibilities Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-[#0D231E] font-heading border-b border-gray-100 pb-3 flex items-center gap-2">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-[#2cb775]" />
                Key Responsibilities & Requirements
              </h2>
              <div
                className="rich-text-content text-gray-700 leading-relaxed text-xs"
                dangerouslySetInnerHTML={{ __html: job.responsibilities }}
              />
            </div>

            {/* Job Benefits Container */}
            {job.benefits && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#0D231E] font-heading border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Icon icon="lucide:gift" className="w-5 h-5 text-[#2cb775]" />
                  Perks & Allowance Benefits
                </h2>
                <div
                  className="rich-text-content text-gray-700 leading-relaxed text-xs"
                  dangerouslySetInnerHTML={{ __html: job.benefits }}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Application Form or Deadline Notice (5 Cols / 40% Width) */}
          <div className="lg:col-span-5 lg:sticky lg:top-10 space-y-6" ref={formRef}>
            {job.isExpired ? (
              /* Deadline Expired Sticky Card */
              <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Icon icon="lucide:clock-4" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-amber-950 font-heading">
                  Applications Closed
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed max-w-xs mx-auto">
                  The application deadline for <strong>{job.title}</strong> expired on <strong>{formatDateStr(job.deadline)}</strong>.
                </p>
                <div className="pt-2">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 bg-[#0D231E] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all hover:bg-[#2cb775]"
                  >
                    <span>Browse Other Job Positions</span>
                    <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Candidate Application Form Card */
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(13,35,30,0.06)] p-6 sm:p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4 space-y-1">
                  <span className="text-[10px] font-bold text-[#2cb775] uppercase tracking-wider">
                    Online Application Portal
                  </span>
                  <h2 className="text-xl font-bold text-[#0D231E] font-heading flex items-center gap-2">
                    Apply for Position
                  </h2>
                  <p className="text-xs text-gray-500">
                    Fill in your details and attach your CV/Resume to apply.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.applicantName}
                      onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.applicantEmail}
                        onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.applicantPhone}
                        onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
                        placeholder="+880 1700 000000"
                        className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Experience Years
                      </label>
                      <input
                        type="text"
                        value={form.experienceYears}
                        onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                        placeholder="e.g. 3 Years"
                        className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Expected Monthly Salary
                      </label>
                      <input
                        type="text"
                        value={form.expectedSalary}
                        onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                        placeholder="e.g. 80,000 BDT"
                        className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current / Previous Company
                    </label>
                    <input
                      type="text"
                      value={form.currentCompany}
                      onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
                      placeholder="e.g. Acme Tours & Travels Ltd."
                      className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                    />
                  </div>

                  {/* Drag-and-Drop Resume Box */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Attach Resume / CV (PDF, DOC, DOCX) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-[#2cb775] rounded-2xl p-5 text-center transition-colors bg-gray-50/50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        hidden
                      />
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-[#2cb775] font-bold">
                          <Icon icon="lucide:file-check" className="w-5 h-5" />
                          <span className="truncate max-w-[180px]">{resumeFile.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setResumeFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 cursor-pointer"
                          >
                            <Icon icon="lucide:x" className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer space-y-1.5"
                        >
                          <Icon icon="lucide:upload-cloud" className="w-7 h-7 text-gray-400 mx-auto" />
                          <p className="text-xs font-semibold text-[#0D231E]">
                            Click to upload your CV / Resume
                          </p>
                          <p className="text-[11px] text-gray-400">PDF or DOC format up to 20MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cover Letter / Message to HR
                    </label>
                    <textarea
                      rows={3}
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      placeholder="Briefly introduce yourself..."
                      className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold py-3.5 rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <Icon icon="lucide:send" className="w-4 h-4 text-[#2cb775]" />
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center mx-auto">
              <Icon icon="lucide:check-circle-2" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold font-heading text-[#0D231E]">
              Application Received!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Thank you for applying to <strong>Royal Safari Tours</strong>. Our HR recruitment team will evaluate your application and contact you if shortlisted.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSuccessModal(false)}
                className="bg-[#0D231E] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
