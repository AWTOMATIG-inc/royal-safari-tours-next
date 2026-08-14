"use client";

import { Icon } from "@iconify/react";

export default function GeographicReport({ locations = [] }) {
  if (!locations || locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center py-12 text-gray-500 font-body">
        <Icon icon="lucide:globe" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No geographic data recorded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Geographic Distribution
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Audience location breakdown by Country and City
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-xs font-body min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-3">Country / City</th>
              <th className="py-3 px-3 text-right">Users</th>
              <th className="py-3 px-3 text-right">Sessions</th>
              <th className="py-3 px-3 text-right">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-body">
            {locations.map((loc, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-[#DE8D3D] shrink-0" />
                    <div>
                      <span className="font-semibold text-[#0D231E]">{loc.country}</span>
                      {loc.city && loc.city !== "(not set)" && (
                        <span className="text-gray-400 font-normal text-[11px]"> ({loc.city})</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-bold text-[#0D231E]">
                  {loc.users.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">
                  {loc.sessions.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-gray-500">
                  {loc.events.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
