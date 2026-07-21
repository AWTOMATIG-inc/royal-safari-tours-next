"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ModuleCard({ title, description, icon, href, count }) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.08)] hover:border-[#2cb775]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0D231E] group-hover:bg-[#2cb775] group-hover:text-white group-hover:border-[#2cb775] transition-all duration-300">
          <Icon icon={icon} className="w-6 h-6" />
        </div>
        {count !== undefined && (
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[#0D231E] text-xs font-mono font-bold group-hover:bg-[#DE8D3D] group-hover:text-white transition-colors">
            {count}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-lg text-[#0D231E] group-hover:text-[#2cb775] transition-colors font-inter flex items-center justify-between">
          <span>{title}</span>
          <Icon icon="lucide:arrow-right" className="w-4 h-4 text-gray-400 group-hover:text-[#2cb775] group-hover:translate-x-1 transition-all" />
        </h4>
        {description && (
          <p className="text-xs text-gray-500 font-light font-inter line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
