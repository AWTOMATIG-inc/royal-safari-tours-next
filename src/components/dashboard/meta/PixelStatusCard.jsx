"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function PixelStatusCard({ refreshTrigger }) {
  const [pixel, setPixel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPixelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/meta/pixel");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to fetch pixel statistics.");
      }

      setPixel(data.pixel || null);
    } catch (err) {
      console.error("[Meta Pixel Card Fetch Error]:", err.message);
      setError(err.message || "An error occurred while loading pixel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPixelData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 animate-pulse space-y-4 font-body">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200/70 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-gray-200/70 rounded-md w-32" />
            <div className="h-3 bg-gray-200/50 rounded-md w-24" />
          </div>
        </div>
        <div className="h-32 bg-gray-200/30 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4 font-body">
        <div className="flex items-start gap-3 text-rose-900 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <h4 className="text-xs font-bold font-heading uppercase tracking-wider">Pixel loading failed</h4>
            <p className="text-xs text-rose-700 font-body">{error}</p>
            <button onClick={fetchPixelData} className="underline text-xs font-bold hover:text-rose-900 cursor-pointer">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pixel || pixel.status === "NOT_CONFIGURED") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 font-body space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 text-gray-400 shrink-0">
            <Icon icon="lucide:settings-2" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 font-heading">Meta Pixel</h3>
            <p className="text-[10px] text-gray-400 font-light">Integration not active</p>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-gray-500 text-xs">
          <p className="font-light">
            `META_PIXEL_ID` environment variable is not configured. Define it in your `.env` file to track live user conversions.
          </p>
        </div>
      </div>
    );
  }

  const isFiredRecently = pixel.status === "ACTIVE";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-5 font-body">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#2CB775]/10 text-[#2CB775] shrink-0">
            <Icon icon="lucide:activity" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0D231E] font-heading">
              {pixel.name || "Meta Pixel"}
            </h3>
            <p className="text-[10px] text-gray-500 font-light font-mono">
              ID: {pixel.id}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
          isFiredRecently
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-rose-50 border-rose-200 text-rose-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isFiredRecently ? "bg-emerald-500" : "bg-rose-500"}`} />
          {pixel.status}
        </span>
      </div>

      {/* Meta Stats Panel */}
      <div className="grid grid-cols-2 gap-3 bg-[#F2EFDF]/30 border border-[#F2EFDF]/70 rounded-xl p-3.5 text-xs">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total Event Fired
          </p>
          <p className="text-lg font-bold font-mono text-[#0D231E] mt-0.5">
            {pixel.eventCount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Last Activity
          </p>
          <p className="text-[11px] font-medium text-gray-700 mt-1 truncate" title={pixel.lastReceivedEvent || "Never"}>
            {pixel.lastReceivedEvent || "No recent activity"}
          </p>
        </div>
      </div>

      {/* Events categories list */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Event Breakdown (Last 7 Days)
        </h4>

        {(!pixel.recentEvents || pixel.recentEvents.length === 0) ? (
          <p className="text-xs text-gray-500 font-light font-body py-2 italic">
            No events registered in this timeframe.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {pixel.recentEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2 border-b border-gray-100 last:border-b-0 text-xs font-medium"
              >
                <span className="text-[#0D231E]">{evt.eventName}</span>
                <span className="font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md text-[10px]">
                  {evt.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
