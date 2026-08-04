"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function InsightsCharts({ insights = [], placements = [] }) {
  // Tabs: "trend_spend" | "trend_reach" | "trend_clicks" | "trend_ctr" | "plat_dist" | "place_dist"
  const [activeChart, setActiveChart] = useState("trend_spend");

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs font-body text-center py-12 text-gray-500">
        <Icon icon="lucide:line-chart" className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No platform historical insights data recorded.</p>
      </div>
    );
  }

  // Get list of unique platforms in the insights data
  const uniquePlatforms = Array.from(new Set(insights.map((item) => item.platform)));

  // Brand colors lookup for curves
  const platformColors = {
    Facebook: "#1877F2",
    Instagram: "#E4405F",
    Messenger: "#00B2FF",
    "Audience Network": "#10B981",
    Threads: "#1F2937",
    unknown: "#DE8D3D",
  };

  const getColor = (plat) => platformColors[plat] || platformColors.unknown;

  // --- Process Data for Daily Charts ---
  const dailyGroups = {};
  insights.forEach((item) => {
    const d = item.date;
    if (!dailyGroups[d]) {
      dailyGroups[d] = { date: d, totalSpend: 0, totalReach: 0, totalClicks: 0, platforms: {} };
    }
    dailyGroups[d].platforms[item.platform] = item;
    dailyGroups[d].totalSpend += item.spend;
    dailyGroups[d].totalReach += item.reach;
    dailyGroups[d].totalClicks += item.clicks;
  });

  const dailyList = Object.values(dailyGroups).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dates = dailyList.map((d) => d.date);

  // Chart configuration constants
  const width = 800;
  const height = 240;
  const paddingX = 55;
  const paddingY = 30;

  // Helper to draw daily line curves per platform
  const renderLineChart = (metricKey, label) => {
    // 1. Group insights by platform
    const platformData = {};
    uniquePlatforms.forEach((p) => {
      platformData[p] = dailyList.map((day) => day.platforms[p]?.[metricKey] || 0);
    });

    // 2. Determine max value for vertical scaling
    const maxVal = Math.max(
      ...dailyList.map((day) => Math.max(...uniquePlatforms.map((p) => day.platforms[p]?.[metricKey] || 0))),
      1
    );

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[220px]" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={idx}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#f0ecdc" strokeDasharray="4 4" />
                <text x={paddingX - 10} y={y + 4} className="text-[10px] fill-gray-400 font-mono text-right" textAnchor="end">
                  {metricKey === "ctr" ? `${(ratio * maxVal).toFixed(1)}%` : Math.round(ratio * maxVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Render Line curves per platform */}
          {uniquePlatforms.map((plat) => {
            const color = getColor(plat);
            const points = dailyList.map((day, idx) => {
              const val = day.platforms[plat]?.[metricKey] || 0;
              const x = paddingX + (idx / Math.max(dailyList.length - 1, 1)) * (width - paddingX * 2);
              const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
              return { x, y, val, date: day.date };
            });

            const pathD = points.reduce((acc, pt, i) => {
              return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
            }, "");

            return (
              <g key={plat}>
                <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="white" stroke={color} strokeWidth="1.5" className="group-hover:r-5 transition-all" />
                    <title>{`${plat} - ${pt.date}: ${metricKey === "ctr" ? `${pt.val.toFixed(2)}%` : pt.val.toLocaleString()} ${label}`}</title>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between px-4 text-[9px] sm:text-[10px] text-gray-400 font-body">
          <span>{dates[0]}</span>
          {dates.length > 2 && <span>{dates[Math.floor(dates.length / 2)]}</span>}
          <span>{dates[dates.length - 1]}</span>
        </div>
      </div>
    );
  };

  // Stacked Bar Chart for Spend
  const renderStackedBarChart = () => {
    const maxTotalSpend = Math.max(...dailyList.map((day) => day.totalSpend), 5);
    const barWidth = Math.max(4, Math.min(24, (width - paddingX * 2) / (dailyList.length * 1.5)));

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-h-[220px]" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={idx}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#f0ecdc" strokeDasharray="4 4" />
                <text x={paddingX - 10} y={y + 4} className="text-[10px] fill-gray-400 font-mono text-right" textAnchor="end">
                  ${Math.round(ratio * maxTotalSpend).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {dailyList.map((day, idx) => {
            const x = paddingX + (idx / Math.max(dailyList.length - 1, 1)) * (width - paddingX * 2) - barWidth / 2;
            let currentY = height - paddingY;

            return (
              <g key={day.date}>
                {uniquePlatforms.map((plat) => {
                  const val = day.platforms[plat]?.spend || 0;
                  if (val <= 0) return null;
                  const barHeight = (val / maxTotalSpend) * (height - paddingY * 2);
                  const y = currentY - barHeight;
                  currentY = y; // Stack upwards

                  return (
                    <rect
                      key={plat}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={getColor(plat)}
                      className="transition-all hover:opacity-90 cursor-pointer"
                    >
                      <title>{`${plat} - ${day.date}: $${val.toFixed(2)} Spend`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between px-4 text-[9px] sm:text-[10px] text-gray-400 font-body">
          <span>{dates[0]}</span>
          {dates.length > 2 && <span>{dates[Math.floor(dates.length / 2)]}</span>}
          <span>{dates[dates.length - 1]}</span>
        </div>
      </div>
    );
  };

  // Donut Chart for Platform Distribution
  const renderDonutChart = () => {
    const platformTotals = {};
    let grandTotalSpend = 0;

    insights.forEach((item) => {
      platformTotals[item.platform] = (platformTotals[item.platform] || 0) + item.spend;
      grandTotalSpend += item.spend;
    });

    const segments = Object.keys(platformTotals).map((plat) => {
      const spend = platformTotals[plat];
      const percentage = grandTotalSpend > 0 ? (spend / grandTotalSpend) * 100 : 0;
      return { platform: plat, spend, percentage, color: getColor(plat) };
    }).sort((a, b) => b.spend - a.spend);

    // Donut settings
    let accumulatedPercent = 0;
    const r = 50;
    const perimeter = 2 * Math.PI * r;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 font-body">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            <circle cx="60" cy="60" r={r} fill="transparent" stroke="#f0ecdc" strokeWidth="12" />
            {segments.map((seg, idx) => {
              if (seg.percentage <= 0) return null;
              const strokeLength = (seg.percentage / 100) * perimeter;
              const offset = perimeter - (accumulatedPercent / 100) * perimeter;
              accumulatedPercent += seg.percentage;

              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={r}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${strokeLength} ${perimeter}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-300 hover:stroke-[14px]"
                >
                  <title>{`${seg.platform}: $${seg.spend.toFixed(2)} (${seg.percentage.toFixed(1)}%)`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-heading">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total spend</span>
            <span className="text-sm font-bold text-[#0D231E] font-mono">
              ${grandTotalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 max-w-sm flex-1">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span>{seg.platform}</span>
              </span>
              <span className="font-mono text-gray-500 text-right">
                ${seg.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({seg.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Horizontal Placement Spend distribution meters
  const renderPlacementMeters = () => {
    if (!placements || placements.length === 0) {
      return (
        <p className="text-xs text-gray-500 font-light text-center py-6">
          No placement-level spend recorded.
        </p>
      );
    }

    const sortedPlacements = [...placements].sort((a, b) => b.spend - a.spend).slice(0, 10);
    const maxPlaceSpend = Math.max(...sortedPlacements.map((p) => p.spend), 1);

    return (
      <div className="space-y-4 py-2 text-xs font-medium">
        {sortedPlacements.map((pl, idx) => {
          const widthPct = (pl.spend / maxPlaceSpend) * 100;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-gray-700">
                <span className="font-bold text-[#0D231E]">{pl.placement}</span>
                <span className="font-mono text-gray-500 bg-[#F2EFDF]/40 px-2 py-0.5 rounded-md text-[10px]">
                  ${pl.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full h-2 bg-[#F2EFDF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%`, backgroundColor: getColor(pl.platform) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 sm:space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Ad Channel Visualizations
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            Compare and track conversions across publisher platforms and ad positions
          </p>
        </div>

        {/* Chart View selector tabs */}
        <div className="inline-flex flex-wrap p-1 bg-[#F2EFDF]/60 rounded-xl border border-gray-200/70 self-start sm:self-auto gap-0.5">
          {[
            { key: "trend_spend", label: "Spend Bar" },
            { key: "trend_reach", label: "Reach Line" },
            { key: "trend_clicks", label: "Clicks Line" },
            { key: "trend_ctr", label: "CTR Line" },
            { key: "plat_dist", label: "Platform %" },
            { key: "place_dist", label: "Top Placements" },
          ].map((chart) => (
            <button
              key={chart.key}
              onClick={() => setActiveChart(chart.key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeChart === chart.key
                  ? "bg-[#0D231E] text-white shadow-xs"
                  : "text-[#0D231E]/70 hover:text-[#0D231E]"
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render selected SVG visualization */}
      <div className="border border-gray-100 rounded-xl p-3 sm:p-4 bg-gray-50/20">
        {activeChart === "trend_spend" && renderStackedBarChart()}
        {activeChart === "trend_reach" && renderLineChart("reach", "Users Reached")}
        {activeChart === "trend_clicks" && renderLineChart("clicks", "Clicks")}
        {activeChart === "trend_ctr" && renderLineChart("ctr", "CTR %")}
        {activeChart === "plat_dist" && renderDonutChart()}
        {activeChart === "place_dist" && renderPlacementMeters()}
      </div>

      {/* Color legend shown only for daily comparisons */}
      {activeChart.startsWith("trend_") && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center pt-2 text-[10px] sm:text-xs font-semibold">
          {uniquePlatforms.map((plat) => (
            <span key={plat} className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getColor(plat) }} />
              <span>{plat}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
