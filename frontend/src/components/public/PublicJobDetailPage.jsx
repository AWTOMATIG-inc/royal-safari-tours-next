"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useRef, useMemo } from "react";
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

  const [answersState, setAnswersState] = useState({});

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

  // Parse custom questions
  const customQuestions = useMemo(() => {
    if (!job || !job.customQuestions) return [];
    if (Array.isArray(job.customQuestions)) return job.customQuestions;
    if (typeof job.customQuestions === "string") {
      try {
        return JSON.parse(job.customQuestions);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [job]);

  const handleAnswerChange = (questionText, value) => {
    setAnswersState((prev) => ({
      ...prev,
      [questionText]: value,
    }));
  };

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

    // Validate required custom questions
    for (const q of customQuestions) {
      if (q.required && (!answersState[q.questionText] || !answersState[q.questionText].trim())) {
        toast.error(`Please answer the required question: "${q.questionText}"`);
        return;
      }
    }

    if (!resumeFile) {
      toast.error("Please upload your Resume / CV (PDF, DOC, DOCX)");
      return;
    }

    // Format answers array
    const answersList = customQuestions.map((q) => ({
      questionText: q.questionText,
      answerText: (answersState[q.questionText] || "").trim(),
    }));

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
    formData.append("answers", JSON.stringify(answersList));

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
    setAnswersState({});
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
    <div className="min-h-screen bg-[#fafbfc] font-body pt-28 sm:pt-32 pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 space-y-8 font-body">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between font-body">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            <span>Back to All Openings</span>
          </Link>

          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:text-primary hover:border-gray-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Icon icon="lucide:share-2" className="w-3.5 h-3.5 text-secondary" />
            <span>Share Job</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(13,35,30,0.04)] space-y-6 relative overflow-hidden font-body">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-body">
            <div className="space-y-3 max-w-2xl font-body">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#2cb775]/10 text-[#2cb775] text-xs font-bold font-body">
                  📍 {job.location}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold font-body">
                  {job.jobType}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold font-body">
                  {job.workMode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D231E] font-heading leading-tight">
                {job.title}
              </h1>

              {job.officeTime && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5 font-body">
                  <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-secondary" />
                  <span>Office Hours: {job.officeTime}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0 font-body">
              {job.isExpired ? (
                <div className="px-5 py-3 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 text-center font-body">
                  Application Expired
                </div>
              ) : (
                <button
                  onClick={scrollToApply}
                  className="px-8 py-3.5 rounded-2xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-body"
                >
                  <span>Apply Now</span>
                  <Icon icon="lucide:arrow-down" className="w-4 h-4" />
                </button>
              )}

              <span className="text-[11px] text-gray-400 font-mono text-center md:text-right font-body">
                Deadline: {formatDateStr(job.deadline)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-body">
          {/* Left Column (7 Cols): Rich HTML Overview & Requirements */}
          <div className="lg:col-span-7 space-y-8 font-body">
            {/* Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-body">
              <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2 border-b border-gray-100 pb-3">
                <Icon icon="lucide:info" className="w-5 h-5 text-secondary" />
                Role Overview
              </h3>
              <div
                className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body rich-text-content"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-body">
              <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2 border-b border-gray-100 pb-3">
                <Icon icon="lucide:list-checks" className="w-5 h-5 text-secondary" />
                Key Responsibilities & Qualifications
              </h3>
              <div
                className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body rich-text-content"
                dangerouslySetInnerHTML={{ __html: job.responsibilities }}
              />
            </div>

            {/* Perks & Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-body">
                <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Icon icon="lucide:gift" className="w-5 h-5 text-accent" />
                  Benefits & Perks
                </h3>
                <div
                  className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body rich-text-content"
                  dangerouslySetInnerHTML={{ __html: job.benefits }}
                />
              </div>
            )}
          </div>

          {/* Right Column (5 Cols): Job Application Form */}
          <div className="lg:col-span-5 font-body" ref={formRef}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_25px_rgba(13,35,30,0.04)] space-y-6 sticky top-28 font-body">
              <div className="space-y-1 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-[#0D231E] font-heading flex items-center gap-2">
                  Apply for Position
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in your details and answer screening questions to submit your application.
                </p>
              </div>

              {job.isExpired ? (
                <div className="p-6 text-center bg-sand rounded-2xl border border-gray-200 text-gray-500 text-xs font-body space-y-2">
                  <Icon icon="lucide:clock" className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="font-bold text-gray-700">Applications Closed</p>
                  <p>The deadline for this position has passed.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-body">
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
                        placeholder="e.g. 55000 BDT"
                        className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current Company / Organization
                    </label>
                    <input
                      type="text"
                      value={form.currentCompany}
                      onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
                      placeholder="e.g. Current Employer"
                      className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                    />
                  </div>

                  {/* Render Custom Screening Questions Section */}
                  {customQuestions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-sand/80 border border-gray-200 space-y-4 font-body">
                      <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 border-b border-gray-200 pb-2">
                        <Icon icon="lucide:help-circle" className="w-4 h-4 text-secondary" />
                        Screening Questions ({customQuestions.length})
                      </h4>

                      {customQuestions.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-1.5 font-body">
                          <label className="block text-xs font-semibold text-gray-800">
                            {idx + 1}. {q.questionText} {q.required && <span className="text-rose-500">*</span>}
                          </label>
                          <textarea
                            rows={2}
                            required={q.required}
                            value={answersState[q.questionText] || ""}
                            onChange={(e) => handleAnswerChange(q.questionText, e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white font-body"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Brief Cover Letter / Note
                    </label>
                    <textarea
                      rows={3}
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      placeholder="Write a brief intro highlighting why you're a great fit..."
                      className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                    />
                  </div>

                  {/* Resume Upload Box */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Upload Resume / CV (PDF, DOC) *
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-[#2cb775] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-sand/50"
                    >
                      <Icon icon="lucide:upload-cloud" className="w-6 h-6 text-secondary mx-auto mb-1" />
                      <p className="text-xs font-semibold text-primary">
                        {resumeFile ? resumeFile.name : "Click to browse & upload CV"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Maximum file size 20MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-body"
                  >
                    <Icon icon="lucide:send" className="w-4 h-4 text-secondary" />
                    <span>{submitting ? "Submitting Application..." : "Submit Application"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Icon icon="lucide:check-circle-2" className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-[#0D231E] font-heading">
              Application Submitted!
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              Thank you for applying for the position of <strong>{job.title}</strong>. We have sent a confirmation email to your inbox and our team will review your application soon.
            </p>

            <button
              onClick={() => setSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-[#0D231E] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
