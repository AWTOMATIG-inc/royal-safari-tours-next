"use client";

import { Icon } from "@iconify/react";

export default function StatCard({ title, value, icon, trend, trendType = "up", color = "green" }) {
  const colorMap = {
    green: {
      bg: "bg-[#2cb775]/10",
      text: "text-[#2cb775]",
      border: "border-[#2cb775]/20",
    },
    gold: {
      bg: "bg-[#DE8D3D]/10",
      text: "text-[#DE8D3D]",
      border: "border-[#DE8D3D]/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
  };

  const selectedColor = colorMap[color] || colorMap.green;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_10px_30px_rgba(13,35,30,0.08)] transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-inter">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}>
          <Icon icon={icon} className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-bold text-[#0D231E] font-inter">
          {value}
        </h3>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            trendType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            <Icon icon={trendType === "up" ? "lucide:trending-up" : "lucide:trending-down"} className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
}
