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
    <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 font-body">
      <div className="flex items-center justify-between font-body">
        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-body">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border} border`}>
          <Icon icon={icon} className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between font-body">
        <h3 className="text-3xl font-bold text-primary font-body">
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

