"use client";

import { Icon } from "@iconify/react";

export default function StatCard({ title, value, icon, trend, trendType = "up", color = "green" }) {
  const colorMap = {
    green: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      border: "border-secondary/20",
    },
    gold: {
      bg: "bg-accent/10",
      text: "text-accent",
      border: "border-accent/20",
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
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 font-body min-w-0">
      <div className="flex items-center justify-between gap-2 font-body">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase font-body truncate">
          {title}
        </span>
        <div className={`p-2 sm:p-2.5 rounded-xl ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border shrink-0`}>
          <Icon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-1.5 font-body min-w-0">
        <h3 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-[#0D231E] font-mono tracking-tight min-w-0 truncate">
          {value}
        </h3>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            trendType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            <Icon icon={trendType === "up" ? "lucide:trending-up" : "lucide:trending-down"} className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
}
