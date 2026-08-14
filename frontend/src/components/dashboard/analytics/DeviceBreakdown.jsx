"use client";

import { Icon } from "@iconify/react";

export default function DeviceBreakdown({ devices = [] }) {
  if (!devices || devices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center py-12 text-gray-500 font-body">
        <Icon icon="lucide:monitor" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No device breakdown recorded.</p>
      </div>
    );
  }

  const totalSessions = Math.max(
    devices.reduce((acc, curr) => acc + (curr.sessions || 0), 0),
    1
  );

  const getDeviceIcon = (name) => {
    switch ((name || "").toLowerCase()) {
      case "mobile":
        return "lucide:smartphone";
      case "tablet":
        return "lucide:tablet";
      default:
        return "lucide:monitor";
    }
  };

  const getDeviceTheme = (name) => {
    switch ((name || "").toLowerCase()) {
      case "mobile":
        return { bg: "bg-[#2CB775]", text: "text-[#2CB775]", lightBg: "bg-[#2CB775]/10" };
      case "tablet":
        return { bg: "bg-[#DE8D3D]", text: "text-[#DE8D3D]", lightBg: "bg-[#DE8D3D]/10" };
      default:
        return { bg: "bg-[#0D231E]", text: "text-[#0D231E]", lightBg: "bg-[#0D231E]/10" };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 sm:space-y-5 font-body">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
          Device Category Breakdown
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
          Audience distribution across desktop, mobile, and tablet devices
        </p>
      </div>

      {/* Progress Multi-bar */}
      <div className="w-full bg-[#F2EFDF] rounded-full h-2.5 sm:h-3 flex overflow-hidden">
        {devices.map((d, i) => {
          const pct = ((d.sessions / totalSessions) * 100).toFixed(1);
          const theme = getDeviceTheme(d.device);
          return (
            <div
              key={i}
              className={`${theme.bg} h-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${d.device}: ${pct}%`}
            />
          );
        })}
      </div>

      {/* Device List Items */}
      <div className="space-y-2.5 sm:space-y-3 pt-1 font-body">
        {devices.map((d, idx) => {
          const pct = ((d.sessions / totalSessions) * 100).toFixed(1);
          const theme = getDeviceTheme(d.device);
          const icon = getDeviceIcon(d.device);

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 bg-[#FCFBF7]/60"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`p-2 sm:p-2.5 rounded-xl ${theme.lightBg} ${theme.text}`}>
                  <Icon icon={icon} className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0D231E] capitalize font-body">
                    {d.device}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-light font-body">
                    {d.sessions.toLocaleString()} sessions ({pct}%)
                  </p>
                </div>
              </div>

              <div className="text-right font-body">
                <p className="text-xs font-bold text-[#0D231E]">
                  {d.engagementRate}%
                </p>
                <p className="text-[10px] text-gray-400 font-body">Engaged rate</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
