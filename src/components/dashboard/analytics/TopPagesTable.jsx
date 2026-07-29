"use client";

import { Icon } from "@iconify/react";

function formatSeconds(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function TopPagesTable({ topPages = [] }) {
  if (!topPages || topPages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center py-12 text-gray-500 font-body">
        <Icon icon="lucide:file-text" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No page view data available for this date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Most Visited Pages
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Top website pages by views, unique visitors, and user engagement duration
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs font-body min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-3">Page Path & Title</th>
              <th className="py-3 px-3 text-right">Views</th>
              <th className="py-3 px-3 text-right">Users</th>
              <th className="py-3 px-3 text-right">Avg Duration</th>
              <th className="py-3 px-3 text-right">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-body">
            {topPages.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3 max-w-[200px] sm:max-w-[280px]">
                  <p className="font-semibold text-[#0D231E] truncate" title={item.path}>
                    {item.path}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate" title={item.title}>
                    {item.title}
                  </p>
                </td>
                <td className="py-3 px-3 text-right font-bold text-[#0D231E]">
                  {item.views.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">
                  {item.users.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-semibold text-[#2CB775]">
                  {formatSeconds(item.avgEngagementTime)}
                </td>
                <td className="py-3 px-3 text-right text-gray-500">
                  {item.events.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
