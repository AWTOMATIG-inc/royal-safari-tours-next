"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "lucide:layout-dashboard" },
  { name: "Google Analytics", href: "/dashboard/analytics", icon: "lucide:bar-chart-3" },
  { name: "Meta Analytics", href: "/dashboard/meta-analytics", icon: "lucide:facebook" },
  { name: "Tour Packages", href: "/dashboard/tour-packages", icon: "lucide:package" },
  { name: "Tour Locations", href: "/dashboard/tour-locations", icon: "lucide:map-pin" },
  { name: "Contact Requests", href: "/dashboard/contact-requests", icon: "lucide:mail" },
  { name: "Users", href: "/dashboard/users", icon: "lucide:users" },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: "lucide:bell" },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: "lucide:quote" },
  { name: "Gallery", href: "/dashboard/gallery", icon: "lucide:image" },
  { name: "My Account", href: "/dashboard/account", icon: "lucide:user-cog" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-primary text-white flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out border-r border-white/10 font-body ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 px-2">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-bold text-lg font-heading">
                R
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Royal Safari
                </h2>
                <p className="text-[10px] text-white/60 uppercase font-semibold font-body tracking-widest">
                  Admin Console
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none pr-1 font-body">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
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
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2 font-body">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all font-body"
          >
            <Icon icon="lucide:globe" className="w-4 h-4 text-accent" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl border border-white/20 cursor-pointer"
        aria-label="Open Sidebar Menu"
      >
        <Icon icon="lucide:menu" className="w-6 h-6" />
      </button>
    </>
  );
}

