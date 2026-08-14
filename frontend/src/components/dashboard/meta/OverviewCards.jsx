"use client";

import { Icon } from "@iconify/react";

export default function OverviewCards({ overview }) {
  if (!overview) return null;
  
  const cards = [
    {
      title: "Total Spend",
      value: `$${(overview.totalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "lucide:dollar-sign",
      color: "bg-[#2CB775]/10 text-[#2CB775]",
    },
    {
      title: "Total Reach",
      value: (overview.reach || 0).toLocaleString(),
      icon: "lucide:users",
      color: "bg-[#DE8D3D]/10 text-[#DE8D3D]",
    },
    {
      title: "Impressions",
      value: (overview.impressions || 0).toLocaleString(),
      icon: "lucide:eye",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Link Clicks",
      value: (overview.clicks || 0).toLocaleString(),
      icon: "lucide:mouse-pointer-click",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Average CTR",
      value: `${(overview.ctr || 0).toFixed(2)}%`,
      icon: "lucide:trending-up",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Average CPC",
      value: `$${(overview.cpc || 0).toFixed(2)}`,
      icon: "lucide:coins",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Average CPM",
      value: `$${(overview.cpm || 0).toFixed(2)}`,
      icon: "lucide:layers",
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Active Campaigns",
      value: (overview.activeCampaignCount || 0).toString(),
      icon: "lucide:folder-heart",
      color: "bg-[#0D231E]/10 text-[#0D231E]",
    },
    {
      title: "Active Ads",
      value: (overview.activeAdsCount || 0).toString(),
      icon: "lucide:megaphone",
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
        >
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-body">
              {card.title}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-body text-[#0D231E]">
              {card.value}
            </h3>
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${card.color}`}>
            <Icon icon={card.icon} className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
