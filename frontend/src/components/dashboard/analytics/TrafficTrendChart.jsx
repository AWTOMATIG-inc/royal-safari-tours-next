"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export default function TrafficTrendChart({ trafficTrend = [] }) {
  const [metricKey, setMetricKey] = useState("users"); // "users" | "sessions" | "pageViews"

  if (!trafficTrend || trafficTrend.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs font-body text-center py-10 sm:py-12 text-gray-500">
        <Icon icon="lucide:line-chart" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-xs sm:text-sm font-medium">No traffic trend data recorded for this date range.</p>
      </div>
    );
  }

  // Calculate scaling for SVG
  const values = trafficTrend.map((d) => d[metricKey] || 0);
  const maxValue = Math.max(...values, 5);

  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const points = trafficTrend.map((d, index) => {
    const x =
      paddingX +
      (index / Math.max(trafficTrend.length - 1, 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((d[metricKey] || 0) / maxValue) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : "";

  const metricLabels = {
    users: "Active Visitors",
    sessions: "Sessions",
    pageViews: "Page Views",
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4 sm:space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0D231E] font-heading">
            Traffic Trends Over Time
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-light font-body">
            Daily engagement breakdown of website visitors
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="inline-flex flex-wrap p-1 bg-[#F2EFDF]/60 rounded-xl border border-gray-200/70 self-start sm:self-auto gap-0.5">
          {["users", "sessions", "pageViews"].map((key) => (
            <button
              key={key}
              onClick={() => setMetricKey(key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                metricKey === key
                  ? "bg-[#2CB775] text-white shadow-xs"
                  : "text-[#0D231E]/70 hover:text-[#0D231E]"
              }`}
            >
              {metricLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-h-[180px] sm:min-h-[220px] overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="emeraldTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2CB775" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#2CB775" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f0ecdc"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  className="text-[10px] fill-gray-400 text-right"
                  textAnchor="end"
                >
                  {Math.round(ratio * maxValue)}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaD} fill="url(#emeraldTrendGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#2CB775"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                className="fill-white stroke-[#2CB775] stroke-2 group-hover:r-6 transition-all duration-200"
              />
              <title>{`${pt.date}: ${pt[metricKey]} ${metricLabels[metricKey]}`}</title>
            </g>
          ))}
        </svg>

        {/* Date labels at bottom */}
        <div className="flex justify-between px-4 sm:px-6 pt-2 text-[9px] sm:text-[10px] text-gray-400 font-body">
          <span>{trafficTrend[0]?.date}</span>
          {trafficTrend.length > 2 && (
            <span>
              {trafficTrend[Math.floor(trafficTrend.length / 2)]?.date}
            </span>
          )}
          <span>{trafficTrend[trafficTrend.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
