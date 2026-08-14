"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicJobs } from "@/actions/recruitment";

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const res = await getPublicJobs({ search, workMode });
    setLoading(false);
    if (res.success) {
      setJobs(res.data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workMode]);

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-body text-[#0D231E]">
      {/* Header Banner */}
      <div className="bg-[#0D231E] text-white pt-28 sm:pt-36 pb-16 px-4 sm:px-8 border-b border-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2cb775]/20 text-[#2cb775] text-xs font-semibold uppercase tracking-wider border border-[#2cb775]/30">
            <Icon icon="lucide:sparkles" className="w-3.5 h-3.5" />
            Careers at Royal Safari Tours
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">
            Join Our World-Class Team
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore career opportunities, build unforgettable travel experiences, and shape the future of global tourism.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#2cb775]/10 blur-3xl" />
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(13,35,30,0.06)] border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Icon
              icon="lucide:search"
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search job title or keyword..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#2cb775]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2cb775] w-full sm:w-auto"
            >
              <option value="">All Work Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>

            <button
              onClick={fetchJobs}
              className="bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Loading job postings...</div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_8px_30px_rgba(13,35,30,0.08)] transition-all p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#2cb775]/10 text-[#2cb775] text-xs font-bold uppercase tracking-wider">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      {job.workMode}
                    </span>
                    {job.isExpired && (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold uppercase tracking-wider">
                        Deadline Expired
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold font-heading text-[#0D231E]">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-inter">
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-rose-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:users" className="w-4 h-4 text-[#2cb775]" />
                      {job.vacancies} Vacancies
                    </span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Icon icon="lucide:calendar" className="w-4 h-4 text-amber-500" />
                      Deadline: {formatDateStr(job.deadline)}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold px-6 py-3 rounded-2xl transition-all shadow-md cursor-pointer"
                  >
                    <span>View Details & Apply</span>
                    <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 shadow-xs">
            <Icon icon="lucide:briefcase" className="w-14 h-14 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-700 font-heading">No Active Openings</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              There are currently no job positions matching your search. Please check back soon or clear search filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
