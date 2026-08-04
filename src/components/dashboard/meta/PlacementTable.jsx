"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function PlacementTable({ placements = [] }) {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("spend");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  if (!placements || placements.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs font-body text-center text-gray-500">
        <Icon icon="lucide:folder-search" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
        <p className="text-xs font-medium">No placement breakdown data available.</p>
      </div>
    );
  }

  // 1. Filtering by search query & platform
  let filtered = [...placements];
  
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (pl) =>
        pl.placement.toLowerCase().includes(q) ||
        pl.platform.toLowerCase().includes(q)
    );
  }

  if (platformFilter !== "all") {
    filtered = filtered.filter(
      (pl) => pl.platform.toLowerCase() === platformFilter.toLowerCase()
    );
  }

  // 2. Sorting
  const isAsc = sortOrder === "asc";
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return isAsc ? -1 : 1;
    if (valA > valB) return isAsc ? 1 : -1;
    return 0;
  });

  // Get list of unique platforms present in the data for filter dropdown
  const uniquePlatforms = Array.from(new Set(placements.map((pl) => pl.platform)));

  // 3. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handlePlatformFilterChange = (val) => {
    setPlatformFilter(val);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 space-y-4 font-body">
      {/* Header section with search and filter inputs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Placement Analytics
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            Performance stats broken down by placement surface and ad position
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex items-center bg-[#F2EFDF]/40 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-60 focus-within:border-secondary">
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search placements..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs text-primary focus:outline-hidden font-body"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="text-gray-400 hover:text-rose-500 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => handlePlatformFilterChange(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl text-primary font-medium focus:outline-hidden cursor-pointer bg-white"
          >
            <option value="all">All Platforms</option>
            {uniquePlatforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Placements breakdown Datagrid */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F2EFDF]/50 border-b border-gray-200 text-[#0D231E]/80 font-bold uppercase tracking-wider">
              <th onClick={() => toggleSort("placement")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none">
                <span className="flex items-center gap-1">
                  Placement Position
                  <Icon icon={sortBy === "placement" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
                </span>
              </th>
              <th onClick={() => toggleSort("platform")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-32">
                <span className="flex items-center gap-1">
                  Platform
                  <Icon icon={sortBy === "platform" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
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
              <th onClick={() => toggleSort("impressions")} className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none w-28 text-right">
                <span className="flex items-center gap-1 justify-end">
                  Impressions
                  <Icon icon={sortBy === "impressions" ? (sortOrder === "asc" ? "lucide:chevron-up" : "lucide:chevron-down") : "lucide:chevrons-up-down"} className="w-3.5 h-3.5 text-gray-400" />
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 font-light font-body">
                  <Icon icon="lucide:folder-search" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p>No placements found matching the filters.</p>
                </td>
              </tr>
            ) : (
              paginated.map((pl, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#0D231E]">
                    {pl.placement}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {pl.platform}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                    ${pl.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    {pl.reach.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    {pl.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    {pl.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-[#2CB775]">
                    {pl.ctr.toFixed(2)}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
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
    </div>
  );
}
