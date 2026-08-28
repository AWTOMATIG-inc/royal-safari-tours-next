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
    name: "Contact Inquiries", 
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
    name: "Media Gallery", 
    href: "/dashboard/media", 
    icon: "lucide:folder-open", 
    roles: ["SUPER_ADMIN", "ADMIN"] 
  },
  { 
    name: "Clients Gallery", 
    href: "/dashboard/client-gallery", 
    icon: "lucide:camera", 
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

const bookingSubItems = [
  { name: "Invoices & Receipts", href: "/dashboard/invoices", icon: "lucide:receipt" },
];
const bookingRoles = ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE"];

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

export default function Sidebar({
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  isCollapsed = false,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propSetIsOpen || setInternalIsOpen;

  const pathname = usePathname();
  const { user } = useAuth();

  const isBookingActive = pathname.startsWith("/dashboard/invoices");
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

  const [bookingOpen, setBookingOpen] = useState(isBookingActive);
  const [analyticsOpen, setAnalyticsOpen] = useState(isAnalyticsActive);
  const [hrmOpen, setHrmOpen] = useState(isHrmActive);

  const userRole = user?.role || "USER";
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole));
  const showBooking = bookingRoles.includes(userRole);
  const showAnalytics = analyticsRoles.includes(userRole);
  const showHrm = hrmRoles.includes(userRole);

  const dashboardItem = visibleNavItems.find((i) => i.name === "Dashboard");
  const otherItems = visibleNavItems.filter((i) => i.name !== "Dashboard");

  const handleLinkClick = () => {
    if (propSetIsOpen) {
      propSetIsOpen(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[990] lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[995] bg-[#0D231E] border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20 p-3" : "lg:w-64 p-5"}`}
      >
        <div className="space-y-6 min-w-0">
          {/* Brand Header (Clean single brand layout) */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 px-1">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={`flex items-center gap-2.5 min-w-0 ${
                isCollapsed ? "lg:mx-auto lg:justify-center" : ""
              }`}
              title="Royal Safari Tours Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-bold text-lg font-heading shadow-xs shrink-0">
                R
              </div>
              {!isCollapsed && (
                <div className="min-w-0 hidden lg:block">
                  <h2 className="font-heading text-base font-bold text-white tracking-wide truncate">
                    Royal Safari
                  </h2>
                  <p className="text-[10px] text-white/60 uppercase font-semibold font-body tracking-widest truncate">
                    {userRole === "EMPLOYEE" ? "Employee Portal" : "Admin Console"}
                  </p>
                </div>
              )}
              <div className="min-w-0 lg:hidden">
                <h2 className="font-heading text-base font-bold text-white tracking-wide truncate">
                  Royal Safari
                </h2>
                <p className="text-[10px] text-white/60 uppercase font-semibold font-body tracking-widest truncate">
                  {userRole === "EMPLOYEE" ? "Employee Portal" : "Admin Console"}
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer focus:outline-none shrink-0"
              aria-label="Close Mobile Navigation"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-none pr-0.5 font-body">
            {/* Dashboard Link */}
            {dashboardItem && (
              <Link
                href={dashboardItem.href}
                onClick={handleLinkClick}
                title={isCollapsed ? dashboardItem.name : undefined}
                className={`flex items-center gap-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
                } ${
                  pathname === dashboardItem.href
                    ? "bg-secondary text-white shadow-xs"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon icon={dashboardItem.icon} className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{dashboardItem.name}</span>}
              </Link>
            )}

            {/* BOOKING SECTION DROPDOWN */}
            {showBooking && (
              <div>
                <button
                  onClick={() => setBookingOpen(!bookingOpen)}
                  title={isCollapsed ? "Booking" : undefined}
                  className={`w-full flex items-center justify-between rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body cursor-pointer ${
                    isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    isBookingActive || bookingOpen
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="lucide:calendar-range" className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">Booking</span>}
                  </span>
                  {!isCollapsed && (
                    <Icon
                      icon="lucide:chevron-down"
                      className={`w-4 h-4 transition-transform duration-200 ${
                        bookingOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {bookingOpen && (
                  <div className={`mt-1 space-y-0.5 ${isCollapsed ? "pl-0" : "ml-4 border-l border-white/10 pl-3"}`}>
                    {bookingSubItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleLinkClick}
                          title={isCollapsed ? item.name : undefined}
                          className={`flex items-center gap-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                            isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                          } ${
                            isActive
                              ? "bg-secondary/80 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Dropdown */}
            {showAnalytics && (
              <div>
                <button
                  onClick={() => setAnalyticsOpen(!analyticsOpen)}
                  title={isCollapsed ? "Analytics" : undefined}
                  className={`w-full flex items-center justify-between rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body cursor-pointer ${
                    isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    isAnalyticsActive || analyticsOpen
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="lucide:line-chart" className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">Analytics</span>}
                  </span>
                  {!isCollapsed && (
                    <Icon
                      icon="lucide:chevron-down"
                      className={`w-4 h-4 transition-transform duration-200 ${
                        analyticsOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {analyticsOpen && (
                  <div className={`mt-1 space-y-0.5 ${isCollapsed ? "pl-0" : "ml-4 border-l border-white/10 pl-3"}`}>
                    {analyticsSubItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleLinkClick}
                          title={isCollapsed ? item.name : undefined}
                          className={`flex items-center gap-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                            isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                          } ${
                            isActive
                              ? "bg-secondary/80 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
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
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                    isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    isActive
                      ? "bg-secondary text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}

            {/* HRM Dropdown */}
            {showHrm && (
              <div>
                <button
                  onClick={() => setHrmOpen(!hrmOpen)}
                  title={isCollapsed ? "HRM" : undefined}
                  className={`w-full flex items-center justify-between rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body cursor-pointer ${
                    isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    isHrmActive || hrmOpen
                      ? "bg-[#2cb775] text-white shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon icon="lucide:briefcase" className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">HRM</span>}
                  </span>
                  {!isCollapsed && (
                    <Icon
                      icon="lucide:chevron-down"
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hrmOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {hrmOpen && (
                  <div className={`mt-1 space-y-0.5 ${isCollapsed ? "pl-0" : "ml-4 border-l border-white/10 pl-3"}`}>
                    {hrmSubItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleLinkClick}
                          title={isCollapsed ? item.name : undefined}
                          className={`flex items-center gap-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 font-body ${
                            isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                          } ${
                            isActive
                              ? "bg-secondary/80 text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
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
        <div className="pt-4 border-t border-white/10 font-body">
          <Link
            href="/"
            onClick={handleLinkClick}
            title={isCollapsed ? "Back to Main Site" : undefined}
            className={`flex items-center gap-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all font-body ${
              isCollapsed ? "justify-center p-3" : "px-3.5 py-3"
            }`}
          >
            <Icon icon="lucide:globe" className="w-4 h-4 text-accent shrink-0" />
            {!isCollapsed && <span className="truncate">Back to Main Site</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
