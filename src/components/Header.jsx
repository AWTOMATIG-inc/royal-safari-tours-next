"use client";

import royal_logo from "@/assets/logo/royal-logo.png";
import royal_logo2 from "@/assets/logo/royal-safari-2.png";
import { useAuth } from "@/hook/useAuth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Navigation items config array - easily scalable
const navigationItems = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Tours", path: "/adventure" },
  { id: 3, name: "About Us", path: "/about-us" },
  { id: 4, name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isShowNav, setIsShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user ? user?.role === "admin" : false;
  const searchInputRef = useRef(null);

  // Monitor page scroll to apply sticky shrink transitions
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on path transitions
  useEffect(() => {
    setIsShowNav(false);
    setShowSearch(false);
  }, [pathname]);

  // Focus search input when search overlay triggers & add Escape key listener
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch]);

  if (pathname.includes("/dashboard")) {
    return null;
  }

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to search query page or trigger dynamic search filters
    setShowSearch(false);
    setSearchQuery("");
  };

  // Translucent glassmorphic tokens that dynamically contract when scrolled
  const dockWrapperClass = scrolled
    ? "top-3 sm:top-4 py-2 sm:py-2.5 px-5 sm:px-6 bg-white/90 backdrop-blur-lg border-[#0D231E]/12 shadow-[0_12px_40px_rgba(13,35,30,0.08)]"
    : "top-4 sm:top-6 py-3 sm:py-3.5 px-6 sm:px-8 bg-[#fcfaee]/75 backdrop-blur-lg border-[#0D231E]/8 shadow-[0_8px_30px_rgba(13,35,30,0.04)]";

  return (
    <>
      {/* 1. SUSPENDED FLOATING NAVIGATION DOCK */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-[999] w-[92%] sm:w-[90%] max-w-7xl rounded-[15px] border transition-all duration-500 ease-out font-inter text-[#0D231E] ${dockWrapperClass}`}>
        <nav className="flex items-center justify-between w-full h-9 sm:h-11 ">
          
          {/* LEFT - Horizontally centered logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="Royal Safari Tours Logo">
              <Image
                loading="eager"
                src={royal_logo}
                alt="Royal Safari Tours"
                priority
                className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* CENTER - Navigation Links */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8 text-[13px] font-semibold tracking-[0.2em] uppercase">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.id} className="relative group py-2">
                    <Link
                      href={item.path}
                      className={`transition-colors duration-300 hover:text-[#DE8D3D] ${
                        isActive ? "text-[#DE8D3D]" : "text-[#0D231E]/80"
                      }`}
                    >
                      {item.name}
                    </Link>
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#DE8D3D] transition-all duration-300 origin-center ${
                      isActive ? "w-4 scale-x-100" : "w-0 scale-x-0 group-hover:w-4 group-hover:scale-x-100"
                    }`} />
                  </li>
                );
              })}
              {isAdmin && (
                <li className="relative group py-2">
                  <Link
                    href="/dashboard"
                    className={`transition-colors duration-300 hover:text-[#DE8D3D] ${
                      pathname === "/dashboard" ? "text-[#DE8D3D]" : "text-[#0D231E]/80"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#DE8D3D] transition-all duration-300 origin-center ${
                    pathname === "/dashboard" ? "w-4 scale-x-100" : "w-0 scale-x-0 group-hover:w-4 group-hover:scale-x-100"
                  }`} />
                </li>
              )}
            </ul>
          </div>

          {/* RIGHT - Support triggers and core CTA */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">

            {/* Minimal outline Search trigger */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-1 hover:text-[#DE8D3D] transition-colors cursor-pointer flex items-center justify-center text-[#0D231E]/80"
              aria-label="Toggle site search"
            >
              <Icon icon="lucide:search" width="16" height="16" />
            </button>

            {/* Primary Journey CTA */}
            <Link
              href="/contact"
              className="bg-[#0D231E] hover:bg-[#DE8D3D] hover:scale-[1.02] text-white text-[10px] tracking-[0.2em] font-bold py-2.5 px-5 rounded-full transition-all duration-300 uppercase hoverEffect cursor-pointer shadow-sm hover:shadow"
            >
              Plan Your Journey
            </Link>
          </div>

          {/* Hamburger Menu Toggle (Mobile/Tablet) */}
          <button
            onClick={() => setIsShowNav((prev) => !prev)}
            className="lg:hidden flex items-center justify-center p-1.5 text-[#0D231E] hover:text-[#DE8D3D] transition-colors cursor-pointer z-50"
            aria-expanded={isShowNav}
            aria-label="Toggle drawer menu"
          >
            <Icon
              icon={isShowNav ? "lucide:x" : "lucide:menu"}
              width="24"
              height="24"
            />
          </button>

        </nav>
      </header>

      {/* 2. DYNAMIC SPOTLIGHT SEARCH PANEL OVERLAY (Desktop/Tablet) */}
      <div 
        className={`fixed inset-0 z-[998] bg-[#0D231E]/40 backdrop-blur-sm transition-opacity duration-500 ease-out ${
          showSearch ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSearch(false)}
      />

      <div className={`fixed top-[20%] left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-2xl bg-[#fcfaee] border border-[#0D231E]/12 rounded-[20px] shadow-[0_32px_64px_rgba(13,35,30,0.15)] transition-all duration-500 ease-out transform p-6 ${
        showSearch ? "translate-y-0 scale-100 opacity-100" : "-translate-y-8 scale-95 opacity-0 pointer-events-none"
      }`}>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3.5 pb-4 border-b border-[#0D231E]/10">
          <Icon icon="lucide:search" width="20" height="20" className="text-[#0D231E]/60 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Where would you like to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#0D231E] font-inter text-[16px] placeholder:text-[#0D231E]/40 focus:outline-none py-1"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 hover:text-[#DE8D3D] transition-colors text-[#0D231E]/40 flex items-center justify-center cursor-pointer"
              aria-label="Clear search text"
            >
              <Icon icon="lucide:x-circle" width="16" height="16" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold text-[#0D231E]/50 bg-[#0D231E]/5 border border-[#0D231E]/10 rounded font-sans uppercase">
            ESC
          </kbd>
        </form>
        
        {/* Quick Suggestions / Popular destinations list */}
        <div className="pt-4 text-left">
          <span className="text-[10px] font-bold tracking-widest text-[#0D231E]/40 uppercase block mb-3 font-inter">
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {["Nepal Tour", "Maldives Getaway", "Sajek Valley", "Cox's Bazar Beach", "Sundarbans Safari"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
                className="text-[12px] text-[#0D231E]/80 bg-[#0D231E]/5 hover:bg-[#DE8D3D]/10 hover:text-[#DE8D3D] border border-[#0D231E]/8 hover:border-[#DE8D3D]/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-inter font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MOBILE DRAWER OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isShowNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsShowNav(false)}
      />

      <div
        className={`lg:hidden fixed top-0 right-0 z-[1001] h-screen w-[280px] sm:w-[320px] bg-[#f2efdf] text-green shadow-2xl p-6 border-l border-white/10 transition-transform duration-500 ease-out transform ${
          isShowNav ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between gap-6 overflow-y-auto">
          
          {/* Top Section - Logo & Search */}
          <div className="flex flex-col gap-5">
            {/* Drawer Logo Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <Image
                loading="eager"
                src={royal_logo}
                alt="Royal Safari Tours"
                className="h-8 w-auto object-contain "
              />
              <button
                onClick={() => setIsShowNav(false)}
                className="p-1 text-[#0D231E] hover:text-[#DE8D3D] transition-colors cursor-pointer"
                aria-label="Close menu drawer"
              >
                <Icon icon="lucide:x" width="20" height="20" />
              </button>
            </div>

            {/* Drawer Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D231E] border border-white/10 rounded-[10px] pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40"
              />
              <Icon icon="lucide:search" width="15" height="15" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            </form>
          </div>

          {/* Middle Section - Link items list */}
          <div className="flex-grow py-4 flex flex-col justify-center">
            <ul className="flex flex-col items-center gap-5 text-base font-semibold tracking-wider uppercase">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    onClick={() => setIsShowNav(false)}
                    className={`hover:text-[#DE8D3D] transition-colors ${
                      pathname === item.path ? "text-[#DE8D3D]" : "text-[#0D231E]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsShowNav(false)}
                    className={`hover:text-[#DE8D3D] transition-colors ${
                      pathname === "/dashboard" ? "text-[#DE8D3D]" : "text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Bottom Section - Contact info and CTAs */}
          <div className="flex flex-col gap-5 pt-4 border-t border-white/10">

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">


              <Link
                href="/contact"
                onClick={() => setIsShowNav(false)}
                className="w-full flex items-center justify-center py-3 rounded-[10px] bg-[#DE8D3D] hover:bg-[#c38032] text-white font-bold transition-colors text-xs text-center uppercase tracking-widest"
              >
                Plan Journey
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

