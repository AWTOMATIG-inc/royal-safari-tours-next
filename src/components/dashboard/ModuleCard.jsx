"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ModuleCard({ title, description, icon, href, count }) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 font-body"
    >
      <div className="flex items-center justify-between font-body">
        <div className="w-12 h-12 rounded-xl bg-sand border border-gray-200/80 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all duration-300 shadow-xs">
          <Icon icon={icon} className="w-6 h-6" />
        </div>
        {count !== undefined && (
          <span className="px-2.5 py-1 rounded-full bg-sand text-primary text-xs font-mono font-bold group-hover:bg-accent group-hover:text-white transition-colors">
            {count}
          </span>
        )}
      </div>

      <div className="space-y-1 font-body">
        <h4 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors font-heading flex items-center justify-between">
          <span>{title}</span>
          <Icon icon="lucide:arrow-right" className="w-4 h-4 text-gray-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
        </h4>
        {description && (
          <p className="text-xs text-gray-500 font-light font-body line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

