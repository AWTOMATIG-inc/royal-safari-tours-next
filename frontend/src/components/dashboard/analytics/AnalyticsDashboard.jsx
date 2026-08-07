"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import ConversionsReport from "./ConversionsReport";
import DeviceBreakdown from "./DeviceBreakdown";
import EventsReport from "./EventsReport";
import GeographicReport from "./GeographicReport";
import OverviewCards from "./OverviewCards";
import TopPagesTable from "./TopPagesTable";
import TrafficSourcesTable from "./TrafficSourcesTable";
import TrafficTrendChart from "./TrafficTrendChart";

export default function AnalyticsDashboard() {
  const [preset, setPreset] = useState("30days"); // "today" | "yesterday" | "7days" | "30days" | "90days" | "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = useCallback(
    async (overridePreset = preset, customStart = startDate, customEnd = endDate) => {
      setLoading(true);
      setError(null);

      try {
        let queryUrl = "/api/admin/analytics/google";

        if (overridePreset === "custom") {
          if (customStart && customEnd) {
            queryUrl += `?startDate=${customStart}&endDate=${customEnd}`;
          } else {
            queryUrl += `?startDate=30days`;
          }
        } else {
          queryUrl += `?startDate=${overridePreset}`;
        }

        const res = await fetch(queryUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(
            result?.error?.message || "Failed to retrieve Google Analytics data."
          );
        }

        setData(result);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("[Analytics Dashboard Error]:", err.message);
        setError(err.message || "Unable to connect to Google Analytics.");
      } finally {
        setLoading(false);
      }
    },
    [preset, startDate, endDate]
  );

  useEffect(() => {
    fetchAnalytics();
  }, [preset]);

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchAnalytics("custom", startDate, endDate);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto font-body px-1 sm:px-0">
      {/* Royal Safari Brand Welcome Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#0D231E] text-white p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Emerald Glow */}
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-[#2CB775]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Google Analytics Performance
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-light font-body leading-relaxed">
              Real-time website traffic, audience engagement metrics, acquisition channels, and conversion data directly from Google Analytics 4.
            </p>
          </div>

          {/* Actions & Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchAnalytics()}
              disabled={loading}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 bg-[#2CB775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Icon
                icon="lucide:refresh-cw"
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Selector Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-body">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#DE8D3D]/10 text-[#DE8D3D]">
            <Icon icon="lucide:calendar-days" className="w-5 h-5 text-[#DE8D3D]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0D231E] uppercase tracking-wider font-body">
              Reporting Period
            </h3>
            {lastUpdated && !loading && (
              <p className="text-[11px] text-gray-500 font-light">
                {data?.dateRange?.startDate} to {data?.dateRange?.endDate} ({lastUpdated})
              </p>
            )}
          </div>
        </div>

        {/* Date Range Presets */}
        <div className="inline-flex flex-wrap p-1 sm:p-1.5 bg-[#F2EFDF]/60 rounded-xl sm:rounded-2xl border border-gray-200/70 gap-1 w-full sm:w-auto">
          {[
            { label: "Today", value: "today" },
            { label: "Yesterday", value: "yesterday" },
            { label: "7 Days", value: "7days" },
            { label: "30 Days", value: "30days" },
            { label: "90 Days", value: "90days" },
            { label: "Custom", value: "custom" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => handlePresetChange(p.value)}
              className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                preset === p.value
                  ? "bg-[#2CB775] text-white shadow-xs"
                  : "text-[#0D231E]/70 hover:text-[#0D231E] hover:bg-white/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs Form */}
      {preset === "custom" && (
        <form
          onSubmit={handleCustomSubmit}
          className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 p-4 sm:p-5 bg-[#FCFBF7] rounded-2xl border border-[#2CB775]/20 shadow-xs"
        >
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D231E] mb-1 font-body">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl text-[#0D231E] focus:outline-hidden focus:ring-2 focus:ring-[#2CB775]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D231E] mb-1 font-body">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl text-[#0D231E] focus:outline-hidden focus:ring-2 focus:ring-[#2CB775]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0D231E] hover:bg-[#DE8D3D] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Apply Range
          </button>
        </form>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 text-rose-900 flex items-start gap-3 sm:gap-4 shadow-xs">
          <Icon icon="lucide:alert-triangle" className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold font-heading">Unable to connect to Google Analytics</h4>
            <p className="text-xs text-rose-700 font-body">{error}</p>
            <button
              onClick={() => fetchAnalytics()}
              className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-32 bg-gray-200/70 rounded-2xl" />
            ))}
          </div>
          <div className="h-80 bg-gray-200/70 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200/70 rounded-2xl" />
            <div className="h-96 bg-gray-200/70 rounded-2xl" />
          </div>
        </div>
      ) : (
        data && (
          <div className="space-y-6 sm:space-y-8 font-body">
            {/* KPI Stat Cards */}
            <OverviewCards overview={data.overview} />

            {/* Daily Traffic Trend Chart */}
            <TrafficTrendChart trafficTrend={data.trafficTrend} />

            {/* Traffic Sources & Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficSourcesTable trafficSources={data.trafficSources} />
              <TopPagesTable topPages={data.topPages} />
            </div>

            {/* Device Breakdown & Geographic Report */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DeviceBreakdown devices={data.devices} />
              <GeographicReport locations={data.locations} />
            </div>

            {/* Events & Business Conversions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventsReport events={data.events} />
              <ConversionsReport conversions={data.conversions} />
            </div>
          </div>
        )
      )}
    </div>
  );
}
