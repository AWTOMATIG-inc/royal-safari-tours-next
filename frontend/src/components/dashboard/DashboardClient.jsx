"use client";

import StatCard from "@/components/dashboard/StatCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import DashboardRecentInvoices from "@/components/dashboard/DashboardRecentInvoices";
import DashboardAnalyticsWidget from "@/components/dashboard/DashboardAnalyticsWidget";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useMemo } from "react";

const quickModules = [
  {
    title: "Tour Packages",
    description: "Manage luxury itineraries, pricing, and package details.",
    icon: "lucide:package",
    href: "/dashboard/tour-packages",
    count: "Packages",
  },
  {
    title: "Tour Locations",
    description: "Manage regional sanctuaries, tea estates, and coastal spots.",
    icon: "lucide:map-pin",
    href: "/dashboard/tour-locations",
    count: "Regions",
  },
  {
    title: "Invoices & Receipts",
    description: "Generate A4 Money Receipts, track payments & balance due.",
    icon: "lucide:receipt",
    href: "/dashboard/invoices",
    count: "Billing",
  },
  {
    title: "Analytics & Marketing",
    description: "Track Google Analytics site traffic and Meta Ads campaigns.",
    icon: "lucide:bar-chart-3",
    href: "/dashboard/analytics",
    count: "Traffic",
  },
  {
    title: "Contact Inquiries",
    description: "Review incoming expedition inquiries and trip customizer requests.",
    icon: "lucide:mail",
    href: "/dashboard/contact-requests",
    count: "Inquiries",
  },
  {
    title: "User Control",
    description: "Manage registered users, administrators, and permissions.",
    icon: "lucide:users",
    href: "/dashboard/users",
    count: "Users",
  },
];

export default function DashboardClient({ invoices = [], contactRequests = [], totalInquiries = 0 }) {
  const { user, loading } = useAuth();
  const isEmployee = !loading && user?.role === "EMPLOYEE";

  // Calculate Financial Aggregates
  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + (Number(inv.amountPaid) || 0), 0);
    const totalDue = invoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);
    const paidPercentage = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

    return {
      totalBilled,
      totalPaid,
      totalDue,
      paidPercentage,
    };
  }, [invoices]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-8xl mx-auto font-body pb-12">
      
      {/* 1. TOP WELCOME HERO BANNER */}
      <div className="relative rounded-3xl bg-[#0D231E] text-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Gradient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2cb775]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase font-inter">
              <Icon icon="lucide:sparkles" className="w-4 h-4" />
              ROYAL SAFARI MANAGEMENT
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              {isEmployee ? "Welcome to Employee Portal" : "Welcome to the Admin Console"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {isEmployee ? (
              <>
                <Link
                  href="/dashboard/invoices"
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <span>New Invoice</span>
                </Link>

                <Link
                  href="/dashboard/my-profile"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm cursor-pointer"
                >
                  <Icon icon="lucide:user-circle" className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/tour-packages/create"
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <span>Create Package</span>
                </Link>

                <Link
                  href="/dashboard/invoices"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm cursor-pointer"
                >
                  <Icon icon="lucide:receipt" className="w-4 h-4" />
                  <span>Invoices</span>
                </Link>

                <Link
                  href="/dashboard/contact-requests"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm cursor-pointer"
                >
                  <Icon icon="lucide:mail" className="w-4 h-4" />
                  <span>Inquiries</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE REVENUE & OPERATIONS KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Billed Revenue"
          value={`৳${stats.totalBilled.toLocaleString()}`}
          icon="lucide:wallet"
          trend={`${invoices.length} Invoice${invoices.length === 1 ? "" : "s"}`}
          trendType="up"
          color="green"
        />
        <StatCard
          title="Collected Payments"
          value={`৳${stats.totalPaid.toLocaleString()}`}
          icon="lucide:check-circle"
          trend={`${stats.paidPercentage}% collected`}
          trendType="up"
          color="gold"
        />
        <StatCard
          title="Outstanding Balance"
          value={`৳${stats.totalDue.toLocaleString()}`}
          icon="lucide:alert-circle"
          trend={stats.totalDue > 0 ? "Action needed" : "All cleared"}
          trendType={stats.totalDue > 0 ? "down" : "up"}
          color="purple"
        />
        <StatCard
          title="Expedition Inquiries"
          value={totalInquiries || contactRequests.length}
          icon="lucide:mail"
          trend="Customer leads"
          trendType="up"
          color="blue"
        />
      </div>

      {/* 3. CHART.JS REVENUE & MARKETING ANALYTICS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Chart.js Revenue Collection Analytics */}
        <div className="xl:col-span-7">
          <RevenueChart stats={stats} invoices={invoices} />
        </div>

        {/* Right: Chart.js Marketing Analytics Widget */}
        <div className="xl:col-span-5">
          <DashboardAnalyticsWidget />
        </div>
      </div>

      {/* 4. RECENT INVOICES & MONEY RECEIPTS TABLE */}
      <DashboardRecentInvoices invoices={invoices} />

      {/* 5. RECENT EXPEDITION INQUIRIES FEED */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
              <Icon icon="lucide:message-square" className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0D231E] font-inter">
                Recent Customer Inquiries
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-inter">
                Incoming messages & tour customizer requests
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/contact-requests"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Inquiries</span>
            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
          </Link>
        </div>

        {contactRequests.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            No customer inquiries received yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactRequests.slice(0, 4).map((req) => (
              <div
                key={req._id || req.id}
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-purple-200 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {req.name?.charAt(0) || "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{req.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{req.phone || req.email}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md shrink-0">
                    Inquiry
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 italic bg-white p-2.5 rounded-xl border border-gray-100/80">
                  "{req.message || req.packageOfInterest || "Requested tour details and pricing."}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {req.email && (
                    <a
                      href={`mailto:${req.email}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:border-purple-300 transition-colors flex items-center gap-1"
                    >
                      <Icon icon="lucide:mail" className="w-3 h-3 text-purple-600" />
                      <span>Email</span>
                    </a>
                  )}
                  {req.phone && (
                    <a
                      href={`tel:${req.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:border-purple-300 transition-colors flex items-center gap-1"
                    >
                      <Icon icon="lucide:phone" className="w-3 h-3 text-emerald-600" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. QUICK OPERATIONS SHORTCUT GRID */}
      {!isEmployee && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#0D231E] font-inter">
              Quick Operations Shortcuts
            </h2>
            <span className="text-xs text-gray-500 font-inter">
              {quickModules.length} Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {quickModules.map((mod) => (
              <ModuleCard key={mod.title} {...mod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
