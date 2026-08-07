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
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 sm:px-8 py-4 mb-8 shadow-xs font-body">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Greeting */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-heading">
            Hello, {user?.name || "Admin"} 👋
          </h2>
          <p className="text-xs text-gray-500 font-light font-body hidden sm:block">
            Welcome back to Royal Safari Tours Management Console
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5 font-body">
          
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-64 font-body">
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full bg-sand border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-body text-primary focus:outline-none focus:border-secondary transition-colors"
            />
            <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* User Profile & Dropdown */}
          <div className="relative font-body">
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
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50 space-y-1 font-body">
                <div className="px-3 py-2 border-b border-gray-100 font-body">
                  <p className="text-xs font-bold text-primary font-heading">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-body truncate">
                    {user?.email || "admin@royalsafari.com"}
                  </p>
                </div>

                <Link
                  href="/dashboard/account"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-sand hover:text-secondary font-body transition-colors"
                >
                  <Icon icon="lucide:user-cog" className="w-4 h-4" />
                  <span>Account Settings</span>
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

