"use client";

import { Icon } from "@iconify/react";

export default function PlatformComparisonTable({ platforms = [] }) {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs font-body text-center text-gray-500">
        <Icon icon="lucide:folder-search" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
        <p className="text-xs font-medium">No platform comparison data available.</p>
      </div>
    );
  }

  // Sorted by spend descending
  const sortedPlatforms = [...platforms].sort((a, b) => b.spend - a.spend);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 space-y-4 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Platform Comparison
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Advertising performance parameters compared side-by-side across publisher platforms
        </p>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F2EFDF]/50 border-b border-gray-200 text-[#0D231E]/80 font-bold uppercase tracking-wider">
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3 text-right">Spend</th>
              <th className="px-4 py-3 text-right">Reach</th>
              <th className="px-4 py-3 text-right">Impressions</th>
              <th className="px-4 py-3 text-right">Clicks</th>
              <th className="px-4 py-3 text-right">CTR</th>
              <th className="px-4 py-3 text-right">CPC</th>
              <th className="px-4 py-3 text-right">CPM</th>
              <th className="px-4 py-3 text-right">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
            {sortedPlatforms.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 font-bold text-[#0D231E]">
                  <span className="flex items-center gap-2">
                    <Icon
                      icon={
                        p.platformKey === "facebook"
                          ? "lucide:facebook"
                          : p.platformKey === "instagram"
                          ? "lucide:instagram"
                          : p.platformKey === "messenger"
                          ? "lucide:message-square"
                          : p.platformKey === "threads"
                          ? "lucide:at-sign"
                          : "lucide:globe"
                      }
                      className={`w-4 h-4 ${
                        p.platformKey === "facebook"
                          ? "text-blue-600"
                          : p.platformKey === "instagram"
                          ? "text-pink-600"
                          : p.platformKey === "messenger"
                          ? "text-blue-400"
                          : "text-gray-600"
                      }`}
                    />
                    {p.platform}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                  ${p.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  {p.reach.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  {p.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  {p.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-[#2CB775]">
                  {p.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  ${p.cpc.toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  ${p.cpm.toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-medium text-gray-500">
                  {p.frequency.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
