"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function DashboardPageHeader({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  onAction,
  actionIcon = "lucide:plus",
}) {
  const handleAction = onActionClick || onAction;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-200/80 font-body">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 font-light font-body">
            {description}
          </p>
        )}
      </div>

      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-accent text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-xs shrink-0 font-body"
          >
            <Icon icon={actionIcon} className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        ) : handleAction ? (
          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center gap-2 bg-[#0D231E] hover:bg-[#1a3a2f] text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-xs shrink-0 font-body cursor-pointer"
          >
            <Icon icon={actionIcon} className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        ) : null
      )}
    </div>
  );
}
