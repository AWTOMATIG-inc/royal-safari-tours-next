"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import OverviewCards from "./OverviewCards";
import PlatformCards from "./PlatformCards";
import PlatformComparisonTable from "./PlatformComparisonTable";
import PlacementTable from "./PlacementTable";
import CampaignTable from "./CampaignTable";
import AdSetTable from "./AdSetTable";
import AdTable from "./AdTable";
import InsightsCharts from "./InsightsCharts";
import PixelStatusCard from "./PixelStatusCard";

export default function MetaDashboard() {
  const [preset, setPreset] = useState("30days"); // "today" | "yesterday" | "7days" | "30days" | "90days" | "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Dashboard overall overview, insights, and campaigns list
  const [overview, setOverview] = useState(null);
  const [insights, setInsights] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Local trigger incremented on refresh to update child components
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tab state for the breakdowns table
  const [activeTab, setActiveTab] = useState("campaigns");

  const fetchMetaAnalytics = useCallback(async (
    overridePreset = preset,
    customStart = startDate,
    customEnd = endDate
  ) => {
    setLoading(true);
    setError(null);
    try {
      let overviewUrl = "/api/admin/meta/overview";
      let insightsUrl = "/api/admin/meta/insights";
      let campaignsUrl = "/api/admin/meta/campaigns";

      const queryParams = new URLSearchParams();
      if (overridePreset === "custom") {
        if (customStart && customEnd) {
          queryParams.set("startDate", customStart);
          queryParams.set("endDate", customEnd);
        } else {
          queryParams.set("startDate", "30days");
        }
      } else {
        queryParams.set("startDate", overridePreset);
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
      
      const [overviewRes, insightsRes, campaignsRes] = await Promise.all([
        fetch(`${overviewUrl}${queryString}`),
        fetch(`${insightsUrl}${queryString}`),
        fetch(`${campaignsUrl}${queryString}&limit=100`),
      ]);

      const overviewData = await overviewRes.json();
      const insightsData = await insightsRes.json();
      const campaignsData = await campaignsRes.json();

      if (!overviewRes.ok || !overviewData.success) {
        throw new Error(overviewData.error?.message || "Failed to retrieve Meta overview data.");
      }
      if (!insightsRes.ok || !insightsData.success) {
        throw new Error(insightsData.error?.message || "Failed to retrieve Meta insights data.");
      }
      if (!campaignsRes.ok || !campaignsData.success) {
        throw new Error(campaignsData.error?.message || "Failed to retrieve Meta campaigns data.");
      }

      setOverview(overviewData);
      setInsights(insightsData.insights || []);
      setCampaigns(campaignsData.campaigns || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("[Meta Dashboard Error]:", err.message);
      setError(err.message || "Unable to connect to Meta Marketing API.");
    } finally {
      setLoading(false);
    }
  }, [preset, startDate, endDate]);

  useEffect(() => {
    fetchMetaAnalytics();
  }, [preset, refreshTrigger]);

  // Auto-refresh interval (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        setRefreshTrigger((prev) => prev + 1);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleManualRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchMetaAnalytics("custom", startDate, endDate);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto font-body px-1 sm:px-0">
      {/* Meta Brand Welcome Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#0D231E] text-white p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Emerald/Blue Glow */}
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-[#2CB775]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Meta Cross-Platform Analytics
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-light font-body leading-relaxed">
              Multi-channel campaign performance, ad placement distribution, and real-time conversion trends across the Meta ecosystem.
            </p>
          </div>

          {/* Refresh Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleManualRefresh}
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
            <Icon icon="lucide:calendar-days" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0D231E] uppercase tracking-wider font-body">
              Reporting Period
            </h3>
            {lastUpdated && !loading && (
              <p className="text-[11px] text-gray-500 font-light">
                {startDate || overview?.dateRange?.startDate || "Loading"} to {endDate || overview?.dateRange?.endDate || "Loading"} ({lastUpdated})
              </p>
            )}
          </div>
        </div>

        {/* Presets Toggle buttons */}
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

      {/* Custom Date Picker Inputs Form */}
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

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 text-rose-900 flex items-start gap-3 sm:gap-4 shadow-xs">
          <Icon icon="lucide:alert-triangle" className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold font-heading">Meta Ads Integration Error</h4>
            <p className="text-xs text-rose-700 font-body">{error}</p>
            <button
              onClick={handleManualRefresh}
              className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Non-blocking breakdown fallback notice */}
      {overview?.hasBreakdownError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-start gap-3 shadow-xs font-body">
          <Icon icon="lucide:info" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider">Breakdowns notice</h4>
            <p className="text-xs text-amber-700">
              Technical details: {overview.breakdownError || "Some breakdown dimensions could not be loaded for this test account. Showing aggregated overview instead."}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && !overview ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200/70 rounded-2xl" />
            ))}
          </div>
          <div className="h-80 bg-gray-200/70 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200/70 rounded-2xl" />
            <div className="h-96 bg-gray-200/70 rounded-2xl" />
          </div>
        </div>
      ) : (
        overview && (
          <div className="space-y-6 sm:space-y-8 font-body">
            {/* 1. Overall Aggregated KPI Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:activity" className="w-5 h-5 text-[#2CB775]" />
                <h3 className="text-sm font-bold text-[#0D231E] uppercase tracking-wider font-heading">
                  Account Aggregate Overview
                </h3>
              </div>
              <OverviewCards overview={overview} />
            </div>

            {/* 2. Platform Overview Cards Section */}
            <PlatformCards platforms={overview.platforms} campaigns={campaigns} />

            {/* 3. Insights Trend Chart & Pixel Status Side-by-Side Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <InsightsCharts insights={insights} placements={overview.placements} />
              </div>
              <div>
                <PixelStatusCard refreshTrigger={refreshTrigger} />
              </div>
            </div>

            {/* 4. Platform Comparison and Placement Tables Grid */}
            <PlatformComparisonTable platforms={overview.platforms} />
            
            <PlacementTable placements={overview.placements} />

            {/* 5. Detailed Data Tables Breakdown with Tab Selectors */}
            <div className="space-y-4">
              <div className="border-b border-gray-200">
                <div className="flex gap-6 -mb-px text-sm font-body">
                  {[
                    { key: "campaigns", label: "Campaigns", icon: "lucide:folder-heart" },
                    { key: "adsets", label: "Ad Sets", icon: "lucide:target" },
                    { key: "ads", label: "Ads", icon: "lucide:megaphone" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 pb-3 font-semibold tracking-wide border-b-2 transition-all duration-200 cursor-pointer ${
                        activeTab === tab.key
                          ? "border-[#2CB775] text-[#2CB775]"
                          : "border-transparent text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <Icon icon={tab.icon} className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {activeTab === "campaigns" && (
                  <CampaignTable
                    startDate={startDate}
                    endDate={endDate}
                    preset={preset}
                    refreshTrigger={refreshTrigger}
                  />
                )}
                {activeTab === "adsets" && (
                  <AdSetTable
                    startDate={startDate}
                    endDate={endDate}
                    preset={preset}
                    refreshTrigger={refreshTrigger}
                  />
                )}
                {activeTab === "ads" && (
                  <AdTable
                    startDate={startDate}
                    endDate={endDate}
                    preset={preset}
                    refreshTrigger={refreshTrigger}
                  />
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
