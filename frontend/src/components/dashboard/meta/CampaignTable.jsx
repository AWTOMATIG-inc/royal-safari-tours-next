"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";

export default function CampaignTable({ startDate, endDate, preset, refreshTrigger }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, Pagination, Status, and Sort parameters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("spend");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Expandable rows state
  const [expandedCampaigns, setExpandedCampaigns] = useState({});

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/admin/meta/campaigns?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}`;
      
      if (preset === "custom") {
        if (startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }
      } else {
        url += `&startDate=${preset}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to fetch campaigns.");
      }

      setCampaigns(data.campaigns || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (err) {
      console.error("[Meta Campaign Table Error]:", err.message);
      setError(err.message || "An error occurred while loading campaigns.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, preset, page, limit, sortBy, sortOrder, status, search, refreshTrigger]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const toggleExpandRow = (id) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 space-y-4 font-body">
      {/* Table Title and Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Campaign Performance
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            Detailed performance parameters at the campaign level (click row dropdown to view platform distribution)
          </p>
        </div>

        {/* Filters and Search Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex items-center bg-[#F2EFDF]/40 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-60 focus-within:border-secondary">
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs text-primary focus:outline-hidden font-body"
            />
            {search && (
              <button onClick={() => handleSearchChange("")} className="text-gray-400 hover:text-rose-500 cursor-pointer">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl text-primary font-medium focus:outline-hidden cursor-pointer bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 text-rose-900 flex items-start gap-3 shadow-xs">
          <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-xs text-rose-700 font-body">{error}</p>
            <button onClick={fetchCampaigns} className="underline text-xs font-bold hover:text-rose-900">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Table Skeleton Loader */}
      {loading ? (
        <div className="space-y-3 animate-pulse py-4">
          <div className="h-10 bg-gray-200/70 rounded-xl" />
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-12 bg-gray-200/50 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Main Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2EFDF]/50 border-b border-gray-200 text-[#0D231E]/80 font-bold uppercase tracking-wider">
                  <th className="px-3 py-3 w-10 select-none"></th>
                  <th onClick={() => toggleSort("name")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none">
                    <span className="flex items-center gap-1">
                      Name
                      <Icon icon={sortBy === "name" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("status")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-28">
                    <span className="flex items-center gap-1">
                      Status
                      <Icon icon={sortBy === "status" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("objective")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-32">
                    <span className="flex items-center gap-1">
                      Objective
                      <Icon icon={sortBy === "objective" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("spend")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-28 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      Spend
                      <Icon icon={sortBy === "spend" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("reach")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-28 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      Reach
                      <Icon icon={sortBy === "reach" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("clicks")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-24 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      Clicks
                      <Icon icon={sortBy === "clicks" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("ctr")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-24 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      CTR
                      <Icon icon={sortBy === "ctr" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-light font-body">
                      <Icon icon="lucide:folder-search" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p>No campaigns found matching the criteria.</p>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => {
                    const isExpanded = !!expandedCampaigns[camp.id];
                    return (
                      <React.Fragment key={camp.id}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-3.5 text-center">
                            <button
                              onClick={() => toggleExpandRow(camp.id)}
                              className="p-1 rounded-lg hover:bg-[#F2EFDF] text-gray-500 hover:text-[#0D231E] transition-all cursor-pointer"
                            >
                              <Icon
                                icon={isExpanded ? "lucide:chevron-down" : "lucide:chevron-right"}
                                className="w-4 h-4"
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[#0D231E] max-w-xs truncate" title={camp.name}>
                            {camp.name}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                              camp.status === "ACTIVE"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${camp.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                              {camp.status.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-normal text-gray-500 uppercase tracking-wider text-[10px]">
                            {camp.objective.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                            ${camp.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono">
                            {camp.reach.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono">
                            {camp.clicks.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-[#2CB775]">
                            {camp.ctr.toFixed(2)}%
                          </td>
                        </tr>

                        {/* Collapsible details layout row */}
                        {isExpanded && (
                          <tr className="bg-[#F2EFDF]/10 border-l-4 border-l-[#2CB775]">
                            <td colSpan={8} className="px-6 py-4">
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Platform Delivery Share
                                </h4>
                                {!camp.platforms || camp.platforms.length === 0 ? (
                                  <p className="text-xs text-gray-500 font-light italic">
                                    No platform delivery data recorded.
                                  </p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {camp.platforms.map((p, idx) => (
                                      <div key={idx} className="bg-white border border-gray-150 rounded-xl p-3 space-y-1">
                                        <p className="font-bold text-gray-800 flex items-center gap-1.5">
                                          <Icon
                                            icon={
                                              p.platform.toLowerCase() === "facebook"
                                                ? "lucide:facebook"
                                                : p.platform.toLowerCase() === "instagram"
                                                ? "lucide:instagram"
                                                : p.platform.toLowerCase() === "messenger"
                                                ? "lucide:message-circle"
                                                : p.platform.toLowerCase() === "threads"
                                                ? "lucide:at-sign"
                                                : "lucide:globe"
                                            }
                                            className="w-3.5 h-3.5 text-[#2CB775]"
                                          />
                                          {p.platform}
                                        </p>
                                        <div className="text-[10px] text-gray-500 space-y-0.5">
                                          <div className="flex justify-between">
                                            <span>Spend:</span>
                                            <span className="font-mono text-gray-800 font-bold">${p.spend.toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Reach:</span>
                                            <span className="font-mono text-gray-800">{p.reach.toLocaleString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Clicks:</span>
                                            <span className="font-mono text-gray-800">{p.clicks.toLocaleString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>CTR:</span>
                                            <span className="font-mono text-[#2CB775] font-bold">{p.ctr.toFixed(2)}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-gray-500 font-light">
                Showing Page <strong className="font-semibold">{page}</strong> of <strong className="font-semibold">{totalPages}</strong> ({totalItems} total)
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
