"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import AttendanceWidget from "./AttendanceWidget";
import {
  getAdminTodayAttendance,
  getAdminMonthlySummary,
  getEmployeeMonthlyDetailedLog,
  getMyAttendanceHistory,
  updateAttendancePolicy,
} from "@/actions/attendance";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/hooks/useAuth";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");

  const [activeTab, setActiveTab] = useState("TODAY"); // "TODAY" or "MONTHLY"
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Admin Today Data
  const [todayData, setTodayData] = useState(null);
  const [todayLoading, setTodayLoading] = useState(false);

  // Admin Monthly Summary Data
  const [monthlySummaryData, setMonthlySummaryData] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  // Detailed Log Modal Data
  const [detailedModal, setDetailedModal] = useState({ open: false, employee: null });
  const [detailedLogData, setDetailedLogData] = useState(null);
  const [detailedLoading, setDetailedLoading] = useState(false);

  // Employee History Data
  const [myHistory, setMyHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Policy Modal
  const [policyModal, setPolicyModal] = useState(false);
  const [policyForm, setPolicyForm] = useState({
    workStartTime: "09:00",
    workEndTime: "18:00",
    lateGraceMinutes: 15,
  });
  const [policySubmitting, setPolicySubmitting] = useState(false);

  const fetchTodayAttendance = async (dateStr) => {
    setTodayLoading(true);
    const res = await getAdminTodayAttendance(dateStr);
    setTodayLoading(false);
    if (res.success) {
      setTodayData(res.data);
      if (res.data?.policy) {
        setPolicyForm({
          workStartTime: res.data.policy.workStartTime || "09:00",
          workEndTime: res.data.policy.workEndTime || "18:00",
          lateGraceMinutes: res.data.policy.lateGraceMinutes || 15,
        });
      }
    }
  };

  const fetchMonthlySummary = async () => {
    setMonthlyLoading(true);
    const res = await getAdminMonthlySummary(selectedMonth, selectedYear, undefined, filterSearch);
    setMonthlyLoading(false);
    if (res.success) {
      setMonthlySummaryData(res.data);
    }
  };

  const fetchMyHistory = async () => {
    setHistoryLoading(true);
    const res = await getMyAttendanceHistory();
    setHistoryLoading(false);
    if (res.success) {
      setMyHistory(res.data);
    }
  };

  const openEmployeeDetailedLog = async (employee) => {
    setDetailedModal({ open: true, employee });
    setDetailedLoading(true);
    const res = await getEmployeeMonthlyDetailedLog(employee.id, selectedMonth, selectedYear);
    setDetailedLoading(false);
    if (res.success) {
      setDetailedLogData(res.data);
    } else {
      toast.error(res.message || "Failed to load employee detailed log");
    }
  };

  useEffect(() => {
    if (canManage) {
      if (activeTab === "TODAY") {
        fetchTodayAttendance(selectedDate);
      } else {
        fetchMonthlySummary();
      }
    } else if (user) {
      fetchMyHistory();
    }
  }, [canManage, user, activeTab, selectedDate, selectedMonth, selectedYear]);

  const handlePolicySubmit = async (e) => {
    e.preventDefault();
    setPolicySubmitting(true);
    const res = await updateAttendancePolicy({
      workStartTime: policyForm.workStartTime,
      workEndTime: policyForm.workEndTime,
      lateGraceMinutes: Number(policyForm.lateGraceMinutes),
    });
    setPolicySubmitting(false);

    if (!res.success) {
      toast.error(res.message || "Failed to update policy");
      return;
    }

    toast.success("Attendance shift policy updated successfully!");
    setPolicyModal(false);
    fetchTodayAttendance(selectedDate);
  };

  const formatTimeStr = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateStr = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <DashboardPageHeader
        title={canManage ? "Attendance Management" : "My Attendance Dashboard"}
        description={
          canManage
            ? "Monitor live daily check-ins, track monthly employee summaries, and inspect GPS coordinates."
            : "Check in/out daily, capture GPS location, and review your monthly attendance log."
        }
        actionText={canManage ? "Shift Settings" : undefined}
        actionIcon="lucide:settings"
        onActionClick={canManage ? () => setPolicyModal(true) : undefined}
      />

      {/* Employee View Top Widget */}
      {!canManage && (
        <div className="space-y-6">
          <AttendanceWidget onAttendanceUpdated={fetchMyHistory} />

          {/* Employee Monthly Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Days Present
              </span>
              <p className="text-2xl font-bold text-[#0D231E] font-heading mt-1">
                {myHistory?.summary?.totalPresent || 0} Days
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Late Check-Ins
              </span>
              <p className="text-2xl font-bold text-amber-600 font-heading mt-1">
                {myHistory?.summary?.totalLate || 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Hours Worked
              </span>
              <p className="text-2xl font-bold text-[#2cb775] font-heading mt-1">
                {myHistory?.summary?.totalHours || 0} hrs
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Avg Daily Hours
              </span>
              <p className="text-2xl font-bold text-blue-600 font-heading mt-1">
                {myHistory?.summary?.avgHours || 0} hrs/day
              </p>
            </div>
          </div>

          {/* Personal Attendance History Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
              <Icon icon="lucide:history" className="w-5 h-5 text-[#2cb775]" />
              Personal Attendance Log
            </h3>

            {historyLoading ? (
              <div className="text-center py-8 text-xs text-gray-400">Loading history...</div>
            ) : myHistory?.attendances && myHistory.attendances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-inter">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Check-In</th>
                      <th className="py-3 px-4">Check-Out</th>
                      <th className="py-3 px-4 text-center">Work Hours</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Check-In Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {myHistory.attendances.map((att) => (
                      <tr key={att.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-bold text-[#0D231E]">
                          {formatDateStr(att.date)}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {formatTimeStr(att.checkInTime)}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {formatTimeStr(att.checkOutTime)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#0D231E]">
                          {att.workHours ? `${att.workHours}h` : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              att.status === "PRESENT"
                                ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                                : att.status === "LATE"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                          {att.checkInLatitude ? (
                            <a
                              href={`https://www.google.com/maps?q=${att.checkInLatitude},${att.checkInLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              {att.checkInLatitude}, {att.checkInLongitude}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No GPS data</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-6 italic text-center">
                No attendance logs recorded for this period yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Admin View */}
      {canManage && (
        <div className="space-y-6">
          {/* Live KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Present Today
                </span>
                <p className="text-2xl font-bold text-[#2cb775] font-heading mt-1">
                  {todayData?.summary?.presentCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775]">
                <Icon icon="lucide:user-check" className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Late Arrivals
                </span>
                <p className="text-2xl font-bold text-amber-600 font-heading mt-1">
                  {todayData?.summary?.lateCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Icon icon="lucide:clock" className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  On Approved Leave
                </span>
                <p className="text-2xl font-bold text-blue-600 font-heading mt-1">
                  {todayData?.summary?.onLeaveCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon icon="lucide:calendar-range" className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Absent / Not Checked
                </span>
                <p className="text-2xl font-bold text-rose-600 font-heading mt-1">
                  {todayData?.summary?.absentCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Icon icon="lucide:user-x" className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* View Mode Switcher and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("TODAY")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "TODAY"
                    ? "bg-[#0D231E] text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Daily Live Monitor
              </button>
              <button
                onClick={() => setActiveTab("MONTHLY")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "MONTHLY"
                    ? "bg-[#0D231E] text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Monthly Summary Table
              </button>
            </div>

            {/* Filter Controls */}
            {activeTab === "TODAY" ? (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#2cb775]"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2cb775]"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-gray-700 focus:outline-none focus:border-[#2cb775]"
                >
                  {[2025, 2026, 2027, 2028].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchMonthlySummary()}
                    placeholder="Search staff..."
                    className="bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#2cb775] w-36 sm:w-44"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: Daily Live Monitor Table */}
          {activeTab === "TODAY" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
              {todayLoading ? (
                <div className="text-center py-12 text-xs text-gray-400">Loading daily attendance records...</div>
              ) : todayData?.records && todayData.records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-inter">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-4 px-6">Employee</th>
                        <th className="py-4 px-6">Department</th>
                        <th className="py-4 px-6">Check-In</th>
                        <th className="py-4 px-6">Check-Out</th>
                        <th className="py-4 px-6 text-center">Work Hours</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">GPS Location Pin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {todayData.records.map((rec) => (
                        <tr key={rec.employee.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {rec.employee.photo ? (
                                <img
                                  src={getImageUrl(rec.employee.photo)}
                                  alt={rec.employee.name}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775] font-bold text-xs">
                                  {rec.employee.name?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-[#0D231E]">{rec.employee.name}</p>
                                <p className="text-[11px] text-gray-400 font-mono">
                                  {rec.employee.employeeId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                              {rec.employee.department}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono font-semibold">
                            {formatTimeStr(rec.attendance?.checkInTime)}
                          </td>
                          <td className="py-4 px-6 font-mono">
                            {formatTimeStr(rec.attendance?.checkOutTime)}
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-[#0D231E]">
                            {rec.attendance?.workHours ? `${rec.attendance.workHours}h` : "—"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                rec.status === "PRESENT"
                                  ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                                  : rec.status === "LATE"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : rec.status === "ON_LEAVE"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {rec.attendance?.checkInLatitude ? (
                              <a
                                href={`https://www.google.com/maps?q=${rec.attendance.checkInLatitude},${rec.attendance.checkInLongitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-blue-600 text-xs font-semibold transition-colors"
                              >
                                <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-rose-500" />
                                View GPS Map
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs italic">No GPS</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 p-8 space-y-3">
                  <Icon icon="lucide:clock" className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-700">No Attendance Logged</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No check-in records have been submitted for this date yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Monthly Summary Table (Optimized Grouped View) */}
          {activeTab === "MONTHLY" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
              {monthlyLoading ? (
                <div className="text-center py-12 text-xs text-gray-400">Loading monthly attendance summary...</div>
              ) : monthlySummaryData?.summary && monthlySummaryData.summary.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-inter">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-4 px-6">Employee</th>
                        <th className="py-4 px-6">Department</th>
                        <th className="py-4 px-6 text-center">On-Time</th>
                        <th className="py-4 px-6 text-center">Late Check-Ins</th>
                        <th className="py-4 px-6 text-center">On Leave</th>
                        <th className="py-4 px-6 text-center">Absent</th>
                        <th className="py-4 px-6 text-center">Total Worked</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {monthlySummaryData.summary.map((row) => (
                        <tr key={row.employee.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {row.employee.photo ? (
                                <img
                                  src={getImageUrl(row.employee.photo)}
                                  alt={row.employee.name}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775] font-bold text-xs">
                                  {row.employee.name?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-[#0D231E]">{row.employee.name}</p>
                                <p className="text-[11px] text-gray-400 font-mono">
                                  {row.employee.employeeId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                              {row.employee.department}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#2cb775]/10 text-[#2cb775]">
                              {row.presentDays} Days
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.lateDays > 0
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {row.lateDays} Days
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.onLeaveDays > 0
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {row.onLeaveDays} Days
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.absentDays > 0
                                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {row.absentDays} Days
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-[#0D231E]">
                            {row.totalHours} hrs
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => openEmployeeDetailedLog(row.employee)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D231E] hover:bg-[#1a3a2f] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Icon icon="lucide:eye" className="w-3.5 h-3.5 text-[#2cb775]" />
                              View Detailed Log
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 p-8 space-y-3">
                  <Icon icon="lucide:users" className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-base font-bold text-gray-700">No Employee Summary Found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No staff records found for {MONTH_NAMES[selectedMonth]} {selectedYear}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Employee Detailed Log Popup Modal */}
      {detailedModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 font-body max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                {detailedModal.employee?.photo ? (
                  <img
                    src={getImageUrl(detailedModal.employee.photo)}
                    alt={detailedModal.employee.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2cb775]/10 flex items-center justify-center text-[#2cb775] font-bold text-base">
                    {detailedModal.employee?.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
                    {detailedModal.employee?.name}
                    <span className="font-mono text-xs text-[#2cb775] bg-[#2cb775]/10 px-2.5 py-0.5 rounded-lg">
                      {detailedModal.employee?.employeeId}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    {detailedModal.employee?.department} • {detailedModal.employee?.designation} • Log for {MONTH_NAMES[selectedMonth]} {selectedYear}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setDetailedModal({ open: false, employee: null });
                  setDetailedLogData(null);
                }}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {/* Monthly KPI Summary Pills */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Present Days
                </span>
                <p className="text-lg font-bold text-[#2cb775]">
                  {detailedLogData?.summary?.presentDays || 0} Days
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Late Arrivals
                </span>
                <p className="text-lg font-bold text-amber-600">
                  {detailedLogData?.summary?.lateDays || 0}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Hours
                </span>
                <p className="text-lg font-bold text-[#0D231E]">
                  {detailedLogData?.summary?.totalHours || 0} hrs
                </p>
              </div>
            </div>

            {/* Daily Log Table */}
            {detailedLoading ? (
              <div className="text-center py-8 text-xs text-gray-400">Loading daily attendance records...</div>
            ) : detailedLogData?.attendances && detailedLogData.attendances.length > 0 ? (
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-inter">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Check-In</th>
                      <th className="py-3 px-4">Check-Out</th>
                      <th className="py-3 px-4 text-center">Work Hours</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">GPS Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {detailedLogData.attendances.map((att) => (
                      <tr key={att.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-bold text-[#0D231E]">
                          {formatDateStr(att.date)}
                        </td>
                        <td className="py-3 px-4 font-mono">{formatTimeStr(att.checkInTime)}</td>
                        <td className="py-3 px-4 font-mono">{formatTimeStr(att.checkOutTime)}</td>
                        <td className="py-3 px-4 text-center font-bold text-[#0D231E]">
                          {att.workHours ? `${att.workHours}h` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              att.status === "PRESENT"
                                ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                                : att.status === "LATE"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {att.checkInLatitude ? (
                            <a
                              href={`https://www.google.com/maps?q=${att.checkInLatitude},${att.checkInLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-rose-500" />
                              View Map
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No GPS</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-6 italic text-center">
                No attendance logs found for this month.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Admin Shift Policy Configuration Modal */}
      {canManage && policyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 font-body">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#0D231E] font-heading flex items-center gap-2">
                <Icon icon="lucide:clock-4" className="w-5 h-5 text-[#2cb775]" />
                Shift & Work Hours Policy
              </h3>
              <button
                onClick={() => setPolicyModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePolicySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Shift Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00"
                    value={policyForm.workStartTime}
                    onChange={(e) => setPolicyForm({ ...policyForm, workStartTime: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-[#2cb775]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Shift End Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18:00"
                    value={policyForm.workEndTime}
                    onChange={(e) => setPolicyForm({ ...policyForm, workEndTime: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-[#2cb775]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Late Grace Period (Minutes) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={policyForm.lateGraceMinutes}
                  onChange={(e) => setPolicyForm({ ...policyForm, lateGraceMinutes: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#2cb775]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Check-ins after {policyForm.workStartTime} + {policyForm.lateGraceMinutes} mins will be marked as LATE.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPolicyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={policySubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2cb775] hover:bg-[#259b63] transition-all shadow-xs cursor-pointer"
                >
                  {policySubmitting ? "Saving Policy..." : "Save Shift Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
