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
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-body text-[#0D231E]">
      {/* Header Banner */}
      <div className="bg-[#0D231E] text-white pt-32 sm:pt-36 pb-32 px-4 sm:px-8 border-b border-gray-800 relative overflow-hidden font-body">
        <div className="max-w-7xl mx-auto space-y-4 text-center relative z-10 font-body">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2cb775]/20 text-[#2cb775] text-xs font-semibold uppercase tracking-wider border border-[#2cb775]/30">
            Careers at Royal Safari Tours
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading">
            Join Royal Safari Team
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore career opportunities, build unforgettable travel experiences, and shape the future of global tourism.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-196 h-96 rounded-full bg-[#2cb775]/10 blur-3xl" />
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 font-body">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(13,35,30,0.06)] border border-gray-100 flex flex-col sm:flex-row items-center gap-4 font-body">
          <div className="relative flex-1 w-full font-body">
            <Icon
              icon="lucide:search"
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search job position, title, or keywords..."
              className="w-full bg-sand/60 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary font-body focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 font-body">
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="bg-sand/60 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-secondary transition-all cursor-pointer"
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

      {/* Job Postings Grid / List */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-4 font-body">
        {loading ? (
          <div className="text-center py-20 text-xs text-gray-400 font-body">
            Loading active job positions...
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4 font-body">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12 items-center overflow-hidden font-body"
              >
                {/* Left Column: Job Title & Specs (6 cols) */}
                <div className="md:col-span-6 p-6 sm:p-7 space-y-2.5 font-body">
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-[#0D231E] tracking-tight">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium font-body">
                    <span className="inline-flex items-center gap-1.5 text-[#2cb775] font-semibold">
                      <Icon icon="lucide:briefcase" className="w-4 h-4 text-[#2cb775]" />
                      Royal Safari Tours
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#2cb775]" />
                      {job.location}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#2cb775]/10 text-[#2cb775] text-[11px] font-semibold font-body">
                      {job.workMode || job.jobType}
                    </span>
                    {job.isExpired && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-200">
                        Deadline Passed
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Column: Deadline & Vacancies (3 cols) */}
                <div className="md:col-span-3 p-5 md:p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-start md:items-center text-left md:text-center font-body">
                  <span className="text-sm font-semibold text-gray-500 font-body">
                    {formatDateStr(job.deadline)}
                  </span>
                  <span className="text-xs text-gray-400 font-light mt-0.5 font-body">
                    No of vacancies : {job.vacancies}
                  </span>
                </div>

                {/* Right Column: View Details Button (3 cols) */}
                <div className="md:col-span-3 p-5 md:p-6 border-t md:border-t-0 md:border-l border-gray-100 flex items-center justify-start md:justify-center font-body">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className={`inline-flex items-center justify-center text-xs font-bold px-7 py-2.5 rounded-xl shadow-xs transition-all duration-300 hover:scale-[1.02] cursor-pointer font-body ${
                      job.isExpired
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
                        : "bg-[#0D231E] hover:bg-[#2cb775] text-white"
                    }`}
                  >
                    <span>View Details</span>
                    <Icon icon="lucide:chevron-right" className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 shadow-xs font-body">
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
