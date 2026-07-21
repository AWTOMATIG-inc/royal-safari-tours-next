"use client";

import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 sm:px-8 py-4 mb-8 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Greeting */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0D231E] font-inter">
            Hello, {user?.name || "Admin"} 👋
          </h2>
          <p className="text-xs text-gray-500 font-light font-inter hidden sm:block">
            Welcome back to Royal Safari Tours Management Console
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-64">
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-inter text-[#0D231E] focus:outline-none focus:border-[#2cb775] transition-colors"
            />
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* User Profile & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                <Image
                  src={
                    user?.avatar
                      ? `/api/uploads/user/${user?.avatar}`
                      : "/avatar.png"
                  }
                  alt={user?.name || "Avatar"}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <Icon icon="lucide:chevron-down" className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-gray-100 shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-[#0D231E] font-inter">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-inter truncate">
                    {user?.email || "admin@royalsafari.com"}
                  </p>
                </div>

                <Link
                  href="/dashboard/account"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 hover:text-[#2cb775] font-inter"
                >
                  <Icon icon="lucide:user-cog" className="w-4 h-4" />
                  <span>Account Settings</span>
                </Link>

                <button
                  onClick={async () => {
                    setShowMenu(false);
                    await logout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-inter cursor-pointer"
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
