"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function DashboardPageHeader({ title, description, actionText, actionHref, actionIcon = "lucide:plus" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-200">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-inter">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 font-light font-inter">
            {description}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-sm shrink-0"
        >
          <Icon icon={actionIcon} className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
