"use client";

import { Icon } from "@iconify/react";

export default function TrafficSourcesTable({ trafficSources = [] }) {
  if (!trafficSources || trafficSources.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center py-12 text-gray-500 font-body">
        <Icon icon="lucide:share-2" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No traffic source data recorded for this date range.</p>
      </div>
    );
  }

  const maxSessions = Math.max(...trafficSources.map((s) => s.sessions || 0), 1);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Traffic Acquisition Sources
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Top sources, mediums, and marketing campaigns driving audience traffic
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs font-body min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-3">Source / Medium</th>
              <th className="py-3 px-3">Campaign</th>
              <th className="py-3 px-3 text-right">Users</th>
              <th className="py-3 px-3 text-right">Sessions</th>
              <th className="py-3 px-3 text-right">Events</th>
              <th className="py-3 px-3 text-right w-24 sm:w-28">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-body">
            {trafficSources.map((item, idx) => {
              const share = Math.round((item.sessions / maxSessions) * 100);
              return (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#0D231E]">
                    <span>{item.source}</span>
                    <span className="text-gray-400 font-normal text-[11px]"> / {item.medium}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 max-w-[130px] truncate">
                    {item.campaign || "(not set)"}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-gray-700">
                    {item.users.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#0D231E]">
                    {item.sessions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500">
                    {item.events.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="w-full bg-[#F2EFDF] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2CB775] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
