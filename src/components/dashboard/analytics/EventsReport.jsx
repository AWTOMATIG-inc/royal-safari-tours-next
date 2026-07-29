"use client";

import { Icon } from "@iconify/react";

export default function EventsReport({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center py-12 text-gray-500 font-body">
        <Icon icon="lucide:zap" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No event records available for this date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Tracked User Events
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Specific interaction triggers and system events recorded by GA4
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs font-body min-w-[360px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-3">Event Name</th>
              <th className="py-3 px-3 text-right">Event Count</th>
              <th className="py-3 px-3 text-right">Active Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-body">
            {events.map((ev, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#2CB775] bg-[#2CB775]/10 px-2.5 py-1 rounded-lg border border-[#2CB775]/20">
                    {ev.eventName}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-[#0D231E]">
                  {ev.count.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">
                  {ev.users.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
