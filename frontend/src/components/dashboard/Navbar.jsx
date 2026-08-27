"use client";

import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { getImageUrl } from "@/lib/getImageUrl";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState, useEffect } from "react";

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function Navbar({
  onToggleMobile,
  isMobileOpen,
  onToggleCollapse,
  isCollapsed,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();

  const isEmployee = user?.role === "EMPLOYEE";
  const profileHref = isEmployee ? "/dashboard/my-profile" : "/dashboard/account";
  const rawPhoto = user?.avatar || user?.photo;
  const avatarUrl = rawPhoto ? getImageUrl(rawPhoto) : null;

  useEffect(() => {
    setImageError(false);
  }, [rawPhoto]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 mb-8 shadow-xs font-body">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle Button & Greeting */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Menu Button */}
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2.5 rounded-xl bg-sand hover:bg-gray-200 text-primary transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle mobile sidebar navigation"
          >
            <Icon
              icon={isMobileOpen ? "lucide:x" : "lucide:menu"}
              className="w-5 h-5 text-primary shrink-0"
            />
          </button>

          {/* Single Desktop Sidebar Collapse/Expand Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-2.5 rounded-xl bg-sand hover:bg-secondary hover:text-white border border-gray-200/90 text-primary transition-all duration-200 cursor-pointer shadow-xs focus:outline-none"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle desktop sidebar collapse"
          >
            <Icon
              icon={isCollapsed ? "lucide:panel-left-open" : "lucide:panel-left-close"}
              className="w-5 h-5 shrink-0"
            />
          </button>

          <div>
            <h2 className="text-base sm:text-2xl font-bold text-primary font-heading">
              Hello, {user?.name || "User"} 👋
            </h2>
            <p className="text-xs text-gray-500 font-light font-body hidden sm:block">
              Welcome back to Royal Safari Tours Management Console
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5 font-body">
          {/* User Profile & Dropdown */}
          <div className="relative font-body">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {avatarUrl && !imageError ? (
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                  <img
                    src={avatarUrl}
                    alt=""
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2cb775]/10 border border-[#2cb775]/20 flex items-center justify-center text-[#2cb775] font-bold text-xs sm:text-sm shrink-0 uppercase">
                  {getInitials(user?.name)}
                </div>
              )}
              <Icon
                icon="lucide:chevron-down"
                className="w-4 h-4 text-gray-500 hidden sm:block"
              />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50 space-y-1 font-body">
                <div className="px-3 py-2 border-b border-gray-100 font-body">
                  <p className="text-xs font-bold text-primary font-heading">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-body truncate">
                    {user?.email || ""}
                  </p>
                </div>

                <Link
                  href={profileHref}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-sand hover:text-secondary font-body transition-colors"
                >
                  <Icon icon={isEmployee ? "lucide:user-circle" : "lucide:user-cog"} className="w-4 h-4" />
                  <span>{isEmployee ? "My Profile" : "Account Settings"}</span>
                </Link>

                <button
                  onClick={async () => {
                    setShowMenu(false);
                    await logout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-body cursor-pointer transition-colors"
                >
                  <Icon icon="lucide:log-out" className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
