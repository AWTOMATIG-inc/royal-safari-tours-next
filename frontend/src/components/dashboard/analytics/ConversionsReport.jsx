"use client";

import { Icon } from "@iconify/react";

export default function ConversionsReport({ conversions = [] }) {
  if (!conversions || conversions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#DE8D3D]/10 text-[#DE8D3D] border border-[#DE8D3D]/20">
            <Icon icon="lucide:target" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
              Key Business Conversions
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
              High-value conversion goals and booking milestones
            </p>
          </div>
        </div>
        <div className="bg-[#FCFBF7] border border-[#DE8D3D]/30 rounded-2xl p-5 sm:p-6 text-center space-y-1.5 font-body">
          <Icon icon="lucide:info" className="w-6 h-6 mx-auto text-[#DE8D3D] mb-1" />
          <p className="text-xs font-bold text-[#0D231E] font-heading">
            No conversion events configured yet in GA4
          </p>
          <p className="text-[11px] text-gray-600 font-light max-w-sm mx-auto leading-relaxed">
            Mark key events (e.g., <code className="font-mono text-[10px] text-[#2CB775]">booking_completed</code>, <code className="font-mono text-[10px] text-[#2CB775]">generate_lead</code>) as key events in your Google Analytics Admin console to track goal conversions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Key Business Conversions
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            High-value user interactions and conversion milestones
          </p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#DE8D3D]/10 text-[#DE8D3D] border border-[#DE8D3D]/20">
          <Icon icon="lucide:target" className="w-5 h-5" />
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs font-body min-w-[360px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-3">Conversion Event</th>
              <th className="py-3 px-3 text-right">Key Event Count</th>
              <th className="py-3 px-3 text-right">Converting Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-body">
            {conversions.map((conv, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-semibold text-[#2CB775] bg-[#2CB775]/10 px-2.5 sm:px-3 py-1 rounded-xl border border-[#2CB775]/20 inline-flex items-center gap-1.5 font-body text-[11px] sm:text-xs">
                    <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5 text-[#2CB775]" />
                    {conv.eventName}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-[#0D231E] text-xs sm:text-sm font-heading">
                  {conv.count.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-gray-700 font-body">
                  {conv.users.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
