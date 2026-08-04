"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";

export default function AdTable({ startDate, endDate, preset, refreshTrigger }) {
  const [ads, setAds] = useState([]);
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

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/admin/meta/ads?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}`;

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
        throw new Error(data.error?.message || "Failed to fetch ads.");
      }

      setAds(data.ads || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (err) {
      console.error("[Meta Ad Table Error]:", err.message);
      setError(err.message || "An error occurred while loading ads.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, preset, page, limit, sortBy, sortOrder, status, search, refreshTrigger]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

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

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 space-y-4 font-body">
      {/* Table Title and Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Ads Performance
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            Detailed performance parameters at the individual ad creative level
          </p>
        </div>

        {/* Filters and Search Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex items-center bg-[#F2EFDF]/40 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-60 focus-within:border-secondary">
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search ads..."
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
            <button onClick={fetchAds} className="underline text-xs font-bold hover:text-rose-900">
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
                  <th onClick={() => toggleSort("name")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none">
                    <span className="flex items-center gap-1">
                      Ad Name
                      <Icon icon={sortBy === "name" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th className="px-4 py-3 select-none w-44">Campaign & Ad Set</th>
                  <th onClick={() => toggleSort("status")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-24">
                    <span className="flex items-center gap-1">
                      Status
                      <Icon icon={sortBy === "status" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("primaryPlatform")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-32">
                    <span className="flex items-center gap-1">
                      Platform
                      <Icon icon={sortBy === "primaryPlatform" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th className="px-4 py-3 select-none max-w-[200px]">Placements Used</th>
                  <th onClick={() => toggleSort("spend")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-24 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      Spend
                      <Icon icon={sortBy === "spend" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("reach")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-24 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      Reach
                      <Icon icon={sortBy === "reach" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort("ctr")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-20 text-right">
                    <span className="flex items-center gap-1 justify-end">
                      CTR
                      <Icon icon={sortBy === "ctr" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-light font-body">
                      <Icon icon="lucide:folder-search" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p>No ads found matching the criteria.</p>
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-[#0D231E] max-w-[180px] truncate" title={ad.name}>
                        {ad.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 max-w-[180px] truncate">
                        <div className="font-bold text-gray-700 truncate" title={ad.campaignName}>{ad.campaignName}</div>
                        <div className="text-[10px] text-gray-400 font-light truncate" title={ad.adSetName}>{ad.adSetName}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          ad.status === "ACTIVE"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ad.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {ad.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#0D231E]">
                        <span className="flex items-center gap-1">
                          <Icon
                            icon={
                              ad.primaryPlatform.toLowerCase() === "facebook"
                                ? "lucide:facebook"
                                : ad.primaryPlatform.toLowerCase() === "instagram"
                                ? "lucide:instagram"
                                : ad.primaryPlatform.toLowerCase() === "messenger"
                                ? "lucide:message-circle"
                                : ad.primaryPlatform.toLowerCase() === "threads"
                                ? "lucide:at-sign"
                                : "lucide:globe"
                            }
                            className="w-3.5 h-3.5 text-[#2CB775] shrink-0"
                          />
                          {ad.primaryPlatform}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-gray-500 font-light max-w-[200px] truncate" title={ad.placementsUsed.join(", ")}>
                        {ad.placementsUsed.join(", ")}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                        ${ad.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono">
                        {ad.reach.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-[#2CB775]">
                        {ad.ctr.toFixed(2)}%
                      </td>
                    </tr>
                  ))
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
