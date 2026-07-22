"use client";

import { Icon } from "@iconify/react";

export default function QuickPackageInfo({ tourPackage }) {
  if (!tourPackage) return null;

  const items = [
    {
      icon: "lucide:clock",
      label: "Duration",
      value: tourPackage.duration || "Multi-Day Tour",
      color: "text-secondary",
    },
    {
      icon: "lucide:map-pin",
      label: "Location",
      value: tourPackage.location || "Bangladesh",
      color: "text-accent",
    },
    {
      icon: "lucide:compass",
      label: "Tour Style",
      value: "Luxury Wilderness",
      color: "text-primary",
    },
    {
      icon: "lucide:shield-check",
      label: "Guaranteed",
      value: "Best Price & Verified",
      color: "text-secondary",
    },
  ];

  return (
    <section className="bg-sand border-b border-gray-200/80 py-6 sm:py-8 font-subheading">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/60 shadow-xs"
            >
              <div className={`p-2.5 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon icon={item.icon} className="w-5 h-5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-primary truncate">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
