"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkInAttendance, checkOutAttendance, getTodayAttendanceStatus } from "@/actions/attendance";

export default function AttendanceWidget({ onAttendanceUpdated }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null, locationName: "" });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    const result = await getTodayAttendanceStatus();
    setLoading(false);
    if (result.success) {
      setStatusData(result.data);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-acquire GPS location if supported
    acquireLocation();
  }, []);

  const acquireLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Math.round(position.coords.latitude * 10000) / 10000;
          const lng = Math.round(position.coords.longitude * 10000) / 10000;
          setLocation({
            latitude: lat,
            longitude: lng,
            locationName: `GPS (${lat}, ${lng})`,
          });
          setGettingLocation(false);
        },
        (error) => {
          console.warn("Geolocation warning:", error.message);
          setGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleCheckIn = async () => {
    setActionSubmitting(true);
    const payload = {
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
      locationName: location.locationName || undefined,
      remarks: remarks ? remarks.trim() : undefined,
    };

    const result = await checkInAttendance(payload);
    setActionSubmitting(false);

    if (!result.success) {
      toast.error(result.message || "Failed to check in");
      return;
    }

    toast.success(result.message || "Checked in successfully!");
    setRemarks("");
    fetchStatus();
    if (onAttendanceUpdated) onAttendanceUpdated();
  };

  const handleCheckOut = async () => {
    setActionSubmitting(true);
    const payload = {
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
      locationName: location.locationName || undefined,
      remarks: remarks ? remarks.trim() : undefined,
    };

    const result = await checkOutAttendance(payload);
    setActionSubmitting(false);

    if (!result.success) {
      toast.error(result.message || "Failed to check out");
      return;
    }

    toast.success(result.message || "Checked out successfully!");
    setRemarks("");
    fetchStatus();
    if (onAttendanceUpdated) onAttendanceUpdated();
  };

  const formatTimeStr = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const attendance = statusData?.attendance;
  const policy = statusData?.policy;

  return (
    <div className="bg-gradient-to-br from-[#0D231E] to-[#163a32] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden font-body">
      {/* Decorative ambient backdrop shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2cb775]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Clock & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Icon icon="lucide:clock" className="w-3.5 h-3.5 animate-pulse" />
              Daily Attendance Counter
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-2 text-white">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </h2>
            <p className="text-xs text-gray-300 font-medium">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Shift Timing info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right">
            <p className="text-[11px] text-gray-300 uppercase tracking-wider font-medium">
              Official Shift Hours
            </p>
            <p className="text-xs font-bold text-white font-mono mt-0.5">
              {policy?.workStartTime || "09:00"} — {policy?.workEndTime || "18:00"}
            </p>
            <p className="text-[10px] text-emerald-400 mt-0.5">
              Grace Period: {policy?.lateGraceMinutes || 15} mins
            </p>
          </div>
        </div>

        {/* Attendance Action State */}
        {loading ? (
          <div className="text-center py-6 text-xs text-gray-300 animate-pulse flex items-center justify-center gap-2">
            <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin text-[#2cb775]" />
            Loading today's attendance status...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Indicator Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    attendance?.checkOutTime
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      : attendance?.checkInTime
                      ? "bg-[#2cb775]/20 text-emerald-300 border border-[#2cb775]/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  <Icon
                    icon={
                      attendance?.checkOutTime
                        ? "lucide:check-circle-2"
                        : attendance?.checkInTime
                        ? "lucide:clock-4"
                        : "lucide:log-in"
                    }
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-gray-300 uppercase tracking-wider font-semibold">
                    Today's Attendance Status
                  </p>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    {attendance?.checkOutTime ? (
                      <span className="text-blue-300">Checked Out (Completed)</span>
                    ) : attendance?.checkInTime ? (
                      <span className="text-emerald-300 flex items-center gap-1.5">
                        Checked In Active
                        {attendance.isLate && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                            Late
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-amber-300">Not Checked In Yet</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Working Hours Counter */}
              {attendance?.checkInTime && (
                <div className="text-right">
                  <p className="text-[10px] text-gray-300 uppercase tracking-wider font-medium">
                    Working Duration
                  </p>
                  <p className="text-sm font-bold font-mono text-emerald-300">
                    {attendance.workHours ? `${attendance.workHours} hrs` : "In Progress..."}
                  </p>
                </div>
              )}
            </div>

            {/* Check-In / Check-Out Timestamps Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Check-In Time</p>
                <p className="text-sm font-bold text-white font-mono mt-1">
                  {formatTimeStr(attendance?.checkInTime)}
                </p>
                {attendance?.checkInLocationName && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 truncate" title={attendance.checkInLocationName}>
                    <Icon icon="lucide:map-pin" className="w-3 h-3 shrink-0" />
                    <span className="truncate">{attendance.checkInLocationName}</span>
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Check-Out Time</p>
                <p className="text-sm font-bold text-white font-mono mt-1">
                  {formatTimeStr(attendance?.checkOutTime)}
                </p>
                {attendance?.checkOutLocationName && (
                  <p className="text-[10px] text-blue-400 mt-1 flex items-center gap-1 truncate" title={attendance.checkOutLocationName}>
                    <Icon icon="lucide:map-pin" className="w-3 h-3 shrink-0" />
                    <span className="truncate">{attendance.checkOutLocationName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* GPS Location & Action Bar */}
            {!attendance?.checkOutTime && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Icon
                      icon="lucide:navigation"
                      className={`w-4 h-4 ${location.latitude ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}
                    />
                    {gettingLocation
                      ? "Acquiring GPS location..."
                      : location.latitude
                      ? `GPS Location: ${location.latitude}, ${location.longitude}`
                      : "GPS Location (Browser Permission Required)"}
                  </span>
                  <button
                    type="button"
                    onClick={acquireLocation}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
                    Refresh GPS
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {!statusData?.hasCheckedIn ? (
                    <button
                      onClick={handleCheckIn}
                      disabled={actionSubmitting}
                      className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-[#2cb775] hover:bg-[#259b63] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icon icon="lucide:log-in" className="w-5 h-5" />
                      {actionSubmitting ? "Processing Check-In..." : "Check In Now"}
                    </button>
                  ) : !statusData?.hasCheckedOut ? (
                    <button
                      onClick={handleCheckOut}
                      disabled={actionSubmitting}
                      className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icon icon="lucide:log-out" className="w-5 h-5" />
                      {actionSubmitting ? "Processing Check-Out..." : "Check Out Now"}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
