"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: "lucide:layout-dashboard", 
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE"] 
  },
  { 
    name: "Tour Packages", 
    href: "/dashboard/tour-packages", 
    icon: "lucide:package", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Tour Locations", 
    href: "/dashboard/tour-locations", 
    icon: "lucide:map-pin", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Contact Requests", 
    href: "/dashboard/contact-requests", 
    icon: "lucide:mail", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Users", 
    href: "/dashboard/users", 
    icon: "lucide:users", 
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"] 
  },
  { 
    name: "Subscribers", 
    href: "/dashboard/subscribers", 
    icon: "lucide:bell", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Testimonials", 
    href: "/dashboard/testimonials", 
    icon: "lucide:quote", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Gallery", 
    href: "/dashboard/gallery", 
    icon: "lucide:image", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "My Profile", 
    href: "/dashboard/my-profile", 
    icon: "lucide:user-circle", 
    roles: ["EMPLOYEE"] 
  },
  { 
    name: "Account Settings", 
    href: "/dashboard/account", 
    icon: "lucide:user-cog", 
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"] 
  },
];

const analyticsSubItems = [
  { name: "Google Analytics", href: "/dashboard/analytics", icon: "lucide:bar-chart-3" },
  { name: "Meta Analytics", href: "/dashboard/meta-analytics", icon: "lucide:facebook" },
];

const analyticsRoles = ["SUPER_ADMIN", "ADMIN"];

const hrmSubItems = [
  { name: "Employees", href: "/dashboard/employees", icon: "lucide:briefcase" },
  { name: "Attendance", href: "/dashboard/attendance", icon: "lucide:clock-4" },
  { name: "Leave Applications", href: "/dashboard/leave-applications", icon: "lucide:calendar-check" },
  { name: "Leave Policies", href: "/dashboard/leave-types", icon: "lucide:calendar-range" },
  { name: "Recruitment (ATS)", href: "/dashboard/recruitment", icon: "lucide:user-plus" },
  { name: "Departments", href: "/dashboard/departments", icon: "lucide:building-2" },
  { name: "Designations", href: "/dashboard/designations", icon: "lucide:badge" },
  { name: "Employment Types", href: "/dashboard/employment-types", icon: "lucide:clock" },
  { name: "Employment Status", href: "/dashboard/employment-statuses", icon: "lucide:shield-check" },
];

const hrmRoles = ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE"];

export default function Sidebar({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propSetIsOpen || setInternalIsOpen;

  const pathname = usePathname();
  const { user } = useAuth();

  const isAnalyticsActive =
    pathname.startsWith("/dashboard/analytics") ||
    pathname.startsWith("/dashboard/meta-analytics");

  const isHrmActive =
    pathname.startsWith("/dashboard/employees") ||
    pathname.startsWith("/dashboard/attendance") ||
    pathname.startsWith("/dashboard/leave-applications") ||
    pathname.startsWith("/dashboard/leave-types") ||
    pathname.startsWith("/dashboard/recruitment") ||
    pathname.startsWith("/dashboard/departments") ||
    pathname.startsWith("/dashboard/designations") ||
    pathname.startsWith("/dashboard/employment-types") ||
    pathname.startsWith("/dashboard/employment-statuses");

  const [analyticsOpen, setAnalyticsOpen] = useState(isAnalyticsActive);
  const [hrmOpen, setHrmOpen] = useState(isHrmActive);

  const userRole = user?.role || "USER";
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole));
  const showAnalytics = analyticsRoles.includes(userRole);
  const showHrm = hrmRoles.includes(userRole);

  const dashboardItem = visibleNavItems.find((i) => i.name === "Dashboard");
  const otherItems = visibleNavItems.filter((i) => i.name !== "Dashboard");

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-primary text-white flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out border-r border-white/10 font-body ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Header Brand & Mobile Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 px-2">
            <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-bold text-lg font-heading shadow-xs">
                R
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Royal Safari
                </h2>
                <p className="text-[10px] text-white/60 uppercase font-semibold font-body tracking-widest">
                  {userRole === "EMPLOYEE" ? "Employee Portal" : "Admin Console"}
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer focus:outline-none"
              aria-label="Close Mobile Navigation"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none pr-1 font-body">
            {/* Dashboard Link */}
            {dashboardItem && (
              <Link
                href={dashboardItem.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                  pathname === dashboardItem.href
                    ? "bg-secondary text-white shadow-xs"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon icon={dashboardItem.icon} className="w-4 h-4 shrink-0" />
                <span>{dashboardItem.name}</span>
              </Link>
            )}

            {/* Analytics Dropdown */}
            {showAnalytics && (
              <div>
                <button
                  onClick={() => setAnalyticsOpen(!analyticsOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body cursor-pointer ${
                    isAnalyticsActive || analyticsOpen
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="lucide:line-chart" className="w-4 h-4 shrink-0" />
                    <span>Analytics</span>
                  </span>
                  <Icon
                    icon="lucide:chevron-down"
                    className={`w-4 h-4 transition-transform duration-200 ${
                      analyticsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {analyticsOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {analyticsSubItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                            isActive
                              ? "bg-secondary/80 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Remaining Top Level Nav Items */}
            {otherItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                    isActive
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* HRM Dropdown */}
            {showHrm && (
              <div>
                <button
                  onClick={() => setHrmOpen(!hrmOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body cursor-pointer ${
                    isHrmActive || hrmOpen
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="lucide:briefcase" className="w-4 h-4 shrink-0" />
                    <span>HRM</span>
                  </span>
                  <Icon
                    icon="lucide:chevron-down"
                    className={`w-4 h-4 transition-transform duration-200 ${
                      hrmOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {hrmOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {hrmSubItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                            isActive
                              ? "bg-secondary/80 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2 font-body">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all font-body"
          >
            <Icon icon="lucide:globe" className="w-4 h-4 text-accent" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
