"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/common/RichTextEditor";
import { createJobPost, updateJobPost } from "@/actions/recruitment";

export default function JobPostModal({ isOpen, onClose, job, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    vacancies: 1,
    officeTime: "09:00 AM - 06:00 PM",
    location: "Dhaka, Bangladesh",
    jobType: "Full-time",
    workMode: "On-site",
    deadline: "",
    description: "",
    responsibilities: "",
    benefits: "",
    customQuestions: [],
    isPublished: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      let questions = [];
      if (job.customQuestions) {
        if (typeof job.customQuestions === "string") {
          try {
            questions = JSON.parse(job.customQuestions);
          } catch (e) {
            questions = [];
          }
        } else if (Array.isArray(job.customQuestions)) {
          questions = job.customQuestions;
        }
      }

      setFormData({
        title: job.title || "",
        vacancies: job.vacancies || 1,
        officeTime: job.officeTime || "09:00 AM - 06:00 PM",
        location: job.location || "Dhaka, Bangladesh",
        jobType: job.jobType || "Full-time",
        workMode: job.workMode || "On-site",
        deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
        description: job.description || "",
        responsibilities: job.responsibilities || "",
        benefits: job.benefits || "",
        customQuestions: questions,
        isPublished: job.isPublished !== undefined ? job.isPublished : true,
      });
    } else {
      setFormData({
        title: "",
        vacancies: 1,
        officeTime: "09:00 AM - 06:00 PM",
        location: "Dhaka, Bangladesh",
        jobType: "Full-time",
        workMode: "On-site",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "<p>We are seeking a talented professional to join our Royal Safari Tours team.</p>",
        responsibilities: "<ul><li>Lead daily operations and ensure seamless tour logistics.</li><li>Manage team schedules and client communications.</li></ul>",
        benefits: "<ul><li>Competitive base salary + performance bonuses.</li><li>Medical insurance & annual tour package allowances.</li></ul>",
        customQuestions: [],
        isPublished: true,
      });
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  // Question Builder Handlers
  const handleAddQuestion = () => {
    const newQ = {
      id: "q_" + Date.now(),
      questionText: "",
      required: true,
    };
    setFormData((prev) => ({
      ...prev,
      customQuestions: [...(prev.customQuestions || []), newQ],
    }));
  };

  const handleUpdateQuestion = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: (prev.customQuestions || []).map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleRemoveQuestion = (id) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: (prev.customQuestions || []).filter((q) => q.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.deadline) {
      toast.error("Please fill in all required job details");
      return;
    }

    // Filter out blank custom questions
    const validQuestions = (formData.customQuestions || []).filter((q) =>
      q.questionText.trim()
    );

    const payload = {
      ...formData,
      customQuestions: validQuestions,
    };

    setLoading(true);
    let res;
    if (job) {
      res = await updateJobPost(job.id, payload);
    } else {
      res = await createJobPost(payload);
    }
    setLoading(false);

    if (!res.success) {
      toast.error(res.message || "Failed to save job post");
      return;
    }

    toast.success(job ? "Job post updated!" : "New job post published successfully!");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 font-body max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 font-body">
          <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
            <Icon icon="lucide:briefcase" className="w-5 h-5 text-[#2cb775]" />
            {job ? "Edit Job Posting" : "Create New Job Opening"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sales & Reservation Specialist"
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Vacancies Count *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Type *
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Work Mode *
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Office Hours Time
              </label>
              <input
                type="text"
                value={formData.officeTime}
                onChange={(e) => setFormData({ ...formData, officeTime: e.target.value })}
                placeholder="e.g. 09:00 AM - 06:00 PM"
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
              />
            </div>
          </div>

          {/* Custom Dynamic Q&A Builder Section */}
          <div className="p-4 rounded-2xl bg-sand/70 border border-gray-200 space-y-3 font-body">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 font-body">
                  <Icon icon="lucide:help-circle" className="w-4 h-4 text-secondary" />
                  Custom Screening Questions (Optional)
                </h4>
                <p className="text-[11px] text-gray-500 font-light mt-0.5">
                  Applicants will be required to answer these questions during application submission.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {formData.customQuestions && formData.customQuestions.length > 0 ? (
              <div className="space-y-2.5 pt-2">
                {formData.customQuestions.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-body"
                  >
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">
                      Q{index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. What is your notice period or availability date?"
                      value={q.questionText}
                      onChange={(e) =>
                        handleUpdateQuestion(q.id, "questionText", e.target.value)
                      }
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-secondary font-body"
                    />

                    <div className="flex items-center gap-3 shrink-0">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            handleUpdateQuestion(q.id, "required", e.target.checked)
                          }
                          className="w-3.5 h-3.5 text-secondary rounded focus:ring-secondary"
                        />
                        <span>Required</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Question"
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-2">
                No custom questions added yet. Click "+ Add Question" to create screening questions.
              </p>
            )}
          </div>

          {/* Rich Text Editors */}
          <RichTextEditor
            label="Job Description Overview"
            required
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            placeholder="Write an inviting overview of the position..."
          />

          <RichTextEditor
            label="Job Responsibilities & Key Requirements"
            required
            value={formData.responsibilities}
            onChange={(val) => setFormData({ ...formData, responsibilities: val })}
            placeholder="List day-to-day responsibilities, qualifications, and requirements..."
          />

          <RichTextEditor
            label="Benefits & Salary Package Perks"
            value={formData.benefits}
            onChange={(val) => setFormData({ ...formData, benefits: val })}
            placeholder="Detail perks, allowance, healthcare, bonuses..."
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-[#2cb775] focus:ring-[#2cb775]"
            />
            <label htmlFor="isPublished" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Publish immediately on public careers portal
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 font-body">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#2cb775] text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Icon icon="lucide:check-circle" className="w-4 h-4 text-[#2cb775]" />
              {loading ? "Saving..." : job ? "Update Job Post" : "Publish Job Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
