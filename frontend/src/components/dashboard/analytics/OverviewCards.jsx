"use client";

import { Icon } from "@iconify/react";

function formatSeconds(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function OverviewCards({ overview }) {
  const {
    users = 0,
    newUsers = 0,
    sessions = 0,
    engagedSessions = 0,
    pageViews = 0,
    eventCount = 0,
    engagementRate = "0.0",
    averageEngagementTime = 0,
  } = overview || {};

  const cards = [
    {
      title: "Total Visitors",
      value: users.toLocaleString(),
      subtitle: `${newUsers.toLocaleString()} new visitors`,
      icon: "lucide:users",
      badgeColor: "bg-[#2CB775]/10 text-[#2CB775] border-[#2CB775]/20",
    },
    {
      title: "Active Sessions",
      value: sessions.toLocaleString(),
      subtitle: `${engagedSessions.toLocaleString()} engaged sessions`,
      icon: "lucide:activity",
      badgeColor: "bg-[#DE8D3D]/10 text-[#DE8D3D] border-[#DE8D3D]/20",
    },
    {
      title: "Screen Pageviews",
      value: pageViews.toLocaleString(),
      subtitle: "Total website page views",
      icon: "lucide:eye",
      badgeColor: "bg-[#0D231E]/10 text-[#0D231E] border-[#0D231E]/20",
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate}%`,
      subtitle: "Engaged session percentage",
      icon: "lucide:percent",
      badgeColor: "bg-[#C49A5C]/10 text-[#C49A5C] border-[#C49A5C]/20",
    },
    {
      title: "Avg Engagement Time",
      value: formatSeconds(averageEngagementTime),
      subtitle: "Average user active duration",
      icon: "lucide:clock",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      title: "Recorded Events",
      value: eventCount.toLocaleString(),
      subtitle: "All GA4 interaction events",
      icon: "lucide:zap",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 font-body">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 sm:space-y-4 font-body"
        >
          <div className="flex items-center justify-between font-body">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase font-body">
              {card.title}
            </span>
            <div className={`p-2 sm:p-2.5 rounded-xl border ${card.badgeColor}`}>
              <Icon icon={card.icon} className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>

          <div className="space-y-1 font-body">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-body tracking-tight">
              {card.value}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
