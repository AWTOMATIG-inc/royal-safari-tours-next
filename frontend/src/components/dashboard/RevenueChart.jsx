"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function RevenueChart({ invoices = [] }) {
  const [chartType, setChartType] = useState("bar"); // "bar" | "doughnut"
  const [datePreset, setDatePreset] = useState("30days"); // "30days" | "7days" | "thisMonth" | "all" | "custom"
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Filter invoices by date preset
  const filteredInvoices = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];
    const now = new Date();

    if (datePreset === "7days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);
      cutoff.setHours(0, 0, 0, 0);
      return invoices.filter((inv) => new Date(inv.invoiceDate || inv.createdAt) >= cutoff);
    }

    if (datePreset === "30days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      cutoff.setHours(0, 0, 0, 0);
      return invoices.filter((inv) => new Date(inv.invoiceDate || inv.createdAt) >= cutoff);
    }

    if (datePreset === "thisMonth") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return invoices.filter((inv) => new Date(inv.invoiceDate || inv.createdAt) >= startOfMonth);
    }

    if (datePreset === "custom" && customStart) {
      const start = new Date(customStart);
      start.setHours(0, 0, 0, 0);
      const end = customEnd ? new Date(customEnd) : new Date();
      end.setHours(23, 59, 59, 999);
      return invoices.filter((inv) => {
        const d = new Date(inv.invoiceDate || inv.createdAt);
        return d >= start && d <= end;
      });
    }

    return invoices; // "all"
  }, [invoices, datePreset, customStart, customEnd]);

  // Aggregates for filtered invoices
  const { totalBilled, totalPaid, totalDue, paidPercentage } = useMemo(() => {
    const billed = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
    const paid = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.amountPaid) || 0), 0);
    const due = filteredInvoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);
    const pct = billed > 0 ? Math.round((paid / billed) * 100) : 0;

    return {
      totalBilled: billed,
      totalPaid: paid,
      totalDue: due,
      paidPercentage: pct,
    };
  }, [filteredInvoices]);

  // Chart Data for Bar Chart
  const barData = {
    labels: ["Total Billed", "Collected Paid", "Balance Due"],
    datasets: [
      {
        label: "Amount (BDT ৳)",
        data: [totalBilled, totalPaid, totalDue],
        backgroundColor: [
          "rgba(13, 35, 30, 0.9)",   // Primary Dark Green #0D231E
          "rgba(44, 183, 117, 0.9)",  // Emerald Green #2cb775
          "rgba(244, 63, 94, 0.9)",   // Rose #f43f5e
        ],
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 42,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D231E",
        titleFont: { family: "Plus Jakarta Sans", size: 12, weight: "bold" },
        bodyFont: { family: "Plus Jakarta Sans", size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ৳${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Plus Jakarta Sans", size: 10, weight: "600" }, color: "#4b5563" },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.04)" },
        ticks: {
          font: { family: "Plus Jakarta Sans", size: 10 },
          color: "#9ca3af",
          callback: (val) => `৳${val >= 1000 ? `${val / 1000}k` : val}`,
        },
      },
    },
  };

  // Chart Data for Doughnut Chart
  const doughnutData = {
    labels: ["Collected Paid", "Pending Due"],
    datasets: [
      {
        data: [totalPaid, totalDue],
        backgroundColor: ["#2cb775", "#f43f5e"],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { family: "Plus Jakarta Sans", size: 11, weight: "600" },
          usePointStyle: true,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: "#0D231E",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.label}: ৳${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4 font-body h-full flex flex-col justify-between">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Icon icon="lucide:bar-chart-3" className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0D231E] font-inter">
              Revenue Analytics
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 font-inter">
              Breakdown of billed revenue vs collected payments
            </p>
          </div>
        </div>

        {/* Filter Controls: Date Preset Selector & View Toggle matching UI styling */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Sleek Date Range Dropdown matching Bar/Ratio Pill Container */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center">
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 text-[#0D231E] rounded-lg font-bold text-xs">
              <Icon icon="lucide:calendar" className="w-3.5 h-3.5 text-[#2cb775] shrink-0" />
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer font-bold text-xs text-[#0D231E] pr-3 focus:ring-0 appearance-none"
              >
                <option value="30days">Last 30 Days</option>
                <option value="7days">Last 7 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
              <Icon icon="lucide:chevron-down" className="w-3.5 h-3.5 text-gray-400 pointer-events-none absolute right-1.5" />
            </div>
          </div>

          {/* Toggle Chart Type (Bar / Ratio) */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                chartType === "bar" ? "bg-white text-[#0D231E] shadow-xs border border-gray-200/60" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon icon="lucide:bar-chart-2" className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
            <button
              onClick={() => setChartType("doughnut")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                chartType === "doughnut" ? "bg-white text-[#0D231E] shadow-xs border border-gray-200/60" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon icon="lucide:pie-chart" className="w-3.5 h-3.5" />
              <span>Ratio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Pickers (Shown if Custom Range is selected) */}
      {datePreset === "custom" && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D231E] text-xs">From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#2cb775] font-mono shadow-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D231E] text-xs">To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#2cb775] font-mono shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="relative min-h-[220px] h-56 w-full py-2">
        {chartType === "bar" ? (
          <Bar data={barData} options={barOptions} />
        ) : (
          <div className="relative h-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-lg sm:text-xl font-extrabold text-[#0D231E] font-mono">
                {paidPercentage}%
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">
                Collected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Metric Footer Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-gray-100">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-gray-50 text-center space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
            Billed
          </span>
          <p className="text-xs font-bold text-gray-900 font-mono truncate">
            ৳{totalBilled.toLocaleString()}
          </p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-50/70 text-center space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider block truncate">
            Paid
          </span>
          <p className="text-xs font-bold text-emerald-700 font-mono truncate">
            ৳{totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="p-2 sm:p-2.5 rounded-2xl bg-rose-50/70 text-center space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-bold text-rose-500 uppercase tracking-wider block truncate">
            Due
          </span>
          <p className="text-xs font-bold text-rose-600 font-mono truncate">
            ৳{totalDue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
