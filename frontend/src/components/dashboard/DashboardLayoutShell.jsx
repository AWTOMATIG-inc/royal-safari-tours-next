"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayoutShell({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore desktop collapsed preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-inter relative">
      <Sidebar
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleToggleCollapse}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Navbar
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onToggleCollapse={handleToggleCollapse}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 px-4 sm:px-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
