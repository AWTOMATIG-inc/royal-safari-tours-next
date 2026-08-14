"use client";

import StatCard from "@/components/dashboard/StatCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import Link from "next/link";

const tourismModules = [
  {
    title: "Tour Packages",
    description: "Manage luxury itineraries, pricing, and package details.",
    icon: "lucide:package",
    href: "/dashboard/tour-packages",
    count: "Active",
  },
  {
    title: "Tour Locations",
    description: "Manage regional sanctuaries, tea estates, and coastal spots.",
    icon: "lucide:map-pin",
    href: "/dashboard/tour-locations",
    count: "Regions",
  },
  {
    title: "Contact Requests",
    description: "Review incoming expedition inquiries and custom trip plans.",
    icon: "lucide:mail",
    href: "/dashboard/contact-requests",
    count: "Inquiries",
  },
  {
    title: "User Management",
    description: "Manage registered users, administrators, and permissions.",
    icon: "lucide:users",
    href: "/dashboard/users",
    count: "Users",
  },
  {
    title: "Subscribers",
    description: "Manage newsletter subscribers and private journal dispatches.",
    icon: "lucide:bell",
    href: "/dashboard/subscribers",
    count: "Circle",
  },
  {
    title: "Testimonials",
    description: "Review and publish authentic customer reviews and ratings.",
    icon: "lucide:quote",
    href: "/dashboard/testimonials",
    count: "Reviews",
  },
  {
    title: "Photo Gallery",
    description: "Manage high-resolution expedition imagery and media assets.",
    icon: "lucide:image",
    href: "/dashboard/gallery",
    count: "Media",
  },
  {
    title: "Account Settings",
    description: "Update your profile credentials and security preferences.",
    icon: "lucide:user-cog",
    href: "/dashboard/account",
    count: "Profile",
  },
];

const hrmModules = [
  {
    title: "Employees",
    description: "Manage employee profiles, assignments, and onboarding.",
    icon: "lucide:briefcase",
    href: "/dashboard/employees",
    count: "Staff",
  },
  {
    title: "Departments",
    description: "Organize teams by department and track headcount.",
    icon: "lucide:building-2",
    href: "/dashboard/departments",
    count: "Teams",
  },
  {
    title: "Designations",
    description: "Define job roles, titles, and hierarchy levels.",
    icon: "lucide:badge",
    href: "/dashboard/designations",
    count: "Roles",
  },
  {
    title: "Employment Types",
    description: "Configure full-time, part-time, and contract categories.",
    icon: "lucide:clock",
    href: "/dashboard/employment-types",
    count: "Types",
  },
  {
    title: "Employment Status",
    description: "Track active, probation, and inactive employment states.",
    icon: "lucide:shield-check",
    href: "/dashboard/employment-statuses",
    count: "Status",
  },
];

export default function DashboardClient({ hrmStats }) {
  const { user, loading } = useAuth();
  const isEmployee = !loading && user?.role === "EMPLOYEE";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-[#0D231E] text-white p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Gradient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2cb775]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase font-inter">
              <Icon icon="lucide:sparkles" className="w-4 h-4" />
              ROYAL SAFARI MANAGEMENT
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {isEmployee ? "Welcome to Employee Portal" : "Welcome to the Admin Console"}
            </h1>
            <p className="text-sm text-white/80 font-light font-inter leading-relaxed">
              {isEmployee
                ? "View your personal staff profile, department directory, and organizational information."
                : "Monitor key metrics, publish new expeditions, and manage customer inquiries seamlessly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isEmployee ? (
              <>
                <Link
                  href="/dashboard/my-profile"
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <Icon icon="lucide:user-circle" className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/dashboard/employees"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                >
                  <Icon icon="lucide:briefcase" className="w-4 h-4" />
                  <span>Employee Directory</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/tour-packages/create"
                  className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <span>Create Package</span>
                </Link>

                <Link
                  href="/dashboard/employees"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                >
                  <Icon icon="lucide:briefcase" className="w-4 h-4" />
                  <span>Manage Employees</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid (Admin Only) */}
      {!isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Tour Packages"
            value="26+"
            icon="lucide:package"
            trend="+12% this month"
            trendType="up"
            color="green"
          />
          <StatCard
            title="Expedition Regions"
            value="14"
            icon="lucide:map-pin"
            trend="Active"
            trendType="up"
            color="gold"
          />
          <StatCard
            title="Contact Requests"
            value="48"
            icon="lucide:mail"
            trend="Inquiries"
            trendType="up"
            color="blue"
          />
          <StatCard
            title="Journal Subscribers"
            value="1,240"
            icon="lucide:bell"
            trend="+8% growth"
            trendType="up"
            color="purple"
          />
        </div>
      )}

      {/* HRM Stat Cards */}
      {hrmStats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0D231E] font-inter">
              HRM Overview
            </h2>
            <span className="text-xs text-gray-500 font-inter">
              Workforce Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Employees"
              value={hrmStats.totalEmployees}
              icon="lucide:users"
              trend="All staff"
              trendType="up"
              color="green"
            />
            <StatCard
              title="Active Employees"
              value={hrmStats.activeEmployees}
              icon="lucide:user-check"
              trend="On duty"
              trendType="up"
              color="blue"
            />
            <StatCard
              title="Probation"
              value={hrmStats.probationEmployees}
              icon="lucide:clock"
              trend="In review"
              trendType="up"
              color="gold"
            />
            <StatCard
              title="Inactive"
              value={hrmStats.inactiveEmployees}
              icon="lucide:user-x"
              trend="Off board"
              trendType="down"
              color="purple"
            />
          </div>
        </div>
      )}

      {/* HRM Management Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0D231E] font-inter">
            HRM Modules
          </h2>
          <span className="text-xs text-gray-500 font-inter">
            {hrmModules.length} Features
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hrmModules.map((mod) => (
            <ModuleCard key={mod.title} {...mod} />
          ))}
        </div>
      </div>

      {/* Tourism Management Modules (Admin Only) */}
      {!isEmployee && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0D231E] font-inter">
              Management Modules
            </h2>
            <span className="text-xs text-gray-500 font-inter">
              {tourismModules.length} Features Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tourismModules.map((mod) => (
              <ModuleCard key={mod.title} {...mod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
