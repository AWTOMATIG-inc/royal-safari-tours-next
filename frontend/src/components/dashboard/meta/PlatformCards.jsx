"use client";

import { Icon } from "@iconify/react";

export default function PlatformCards({ platforms = [], campaigns = [] }) {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="bg-[#F2EFDF]/20 border border-gray-200 rounded-2xl p-6 text-center text-gray-500 text-xs">
        <Icon icon="lucide:info" className="w-5 h-5 mx-auto text-gray-400 mb-1.5" />
        <p className="font-light">
          No platform-specific campaign deliveries detected for this period.
        </p>
      </div>
    );
  }

  // Brand identities & styles lookup table
  const brandThemes = {
    facebook: {
      color: "border-blue-200 bg-blue-50/20 text-blue-600",
      accentBg: "bg-blue-600/10 text-blue-600",
      icon: "lucide:facebook",
    },
    instagram: {
      color: "border-pink-200 bg-pink-50/20 text-pink-600",
      accentBg: "bg-pink-600/10 text-pink-600",
      icon: "lucide:instagram",
    },
    threads: {
      color: "border-gray-300 bg-gray-50/20 text-gray-800",
      accentBg: "bg-gray-800/10 text-gray-800",
      icon: "lucide:at-sign",
    },
    messenger: {
      color: "border-blue-200 bg-blue-50/10 text-blue-400",
      accentBg: "bg-blue-400/10 text-blue-400",
      icon: "lucide:message-circle",
    },
    audience_network: {
      color: "border-emerald-200 bg-emerald-50/20 text-emerald-700",
      accentBg: "bg-emerald-700/10 text-emerald-700",
      icon: "lucide:globe",
    },
  };

  const getTheme = (key) => {
    const k = (key || "").toLowerCase();
    return brandThemes[k] || {
      color: "border-gray-200 bg-gray-50/30 text-gray-700",
      accentBg: "bg-gray-700/10 text-gray-700",
      icon: "lucide:layers",
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon icon="lucide:layers" className="w-5 h-5 text-[#2CB775]" />
        <h3 className="text-sm font-bold text-[#0D231E] uppercase tracking-wider font-heading">
          Meta Platform Breakdown
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((p) => {
          const theme = getTheme(p.platformKey);
          
          // Calculate active campaigns running on this platform
          const activeCampaignsCount = campaigns.filter((c) =>
            c.platforms?.some(
              (cp) => cp.platform.toLowerCase() === p.platform.toLowerCase() && cp.spend > 0
            )
          ).length;

          // Cost per result fallback: spend / click counts if conversions is missing
          const cpr = p.spend && p.clicks ? p.spend / p.clicks : 0;

          return (
            <div
              key={p.platformKey}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md ${theme.color}`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl ${theme.accentBg}`}>
                    <Icon icon={theme.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 font-heading">
                      {p.platform}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-light font-mono uppercase">
                      Publisher Surface
                    </p>
                  </div>
                </div>
                
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2CB775]/10 text-[#2CB775]">
                  <Icon icon="lucide:folder-check" className="w-3.5 h-3.5" />
                  {activeCampaignsCount} Active
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-2 text-xs font-medium">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Spend</p>
                  <p className="text-sm font-bold font-mono text-[#0D231E] mt-0.5">
                    ${p.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Reach</p>
                  <p className="text-sm font-bold font-mono text-gray-700 mt-0.5">
                    {p.reach.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Impressions</p>
                  <p className="text-sm font-bold font-mono text-gray-700 mt-0.5">
                    {p.impressions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Link Clicks</p>
                  <p className="text-sm font-bold font-mono text-gray-700 mt-0.5">
                    {p.clicks.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">CTR</p>
                  <p className="text-sm font-bold font-mono text-[#2CB775] mt-0.5">
                    {p.ctr.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">CPC</p>
                  <p className="text-sm font-bold font-mono text-gray-700 mt-0.5">
                    ${p.cpc.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">CPM</p>
                  <p className="text-sm font-bold font-mono text-gray-700 mt-0.5">
                    ${p.cpm.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Frequency</p>
                  <p className="text-sm font-bold font-mono text-gray-500 mt-0.5">
                    {p.frequency.toFixed(2)}x
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Cost/Result</p>
                  <p className="text-sm font-bold font-mono text-[#DE8D3D] mt-0.5">
                    ${cpr.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
