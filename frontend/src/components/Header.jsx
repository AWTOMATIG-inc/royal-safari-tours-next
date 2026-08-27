"use client";

import royal_logo from "@/assets/logo/royal-logo.png";
import { siteConfig } from "@/config/siteConfig";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { navigationConfig } from "@/config/navigationConfig";

const navigationItems = navigationConfig.mainNav;

export default function Header() {
  const [isShowNav, setIsShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
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

  // Close drawer & search popup on path transitions
  useEffect(() => {
    setIsShowNav(false);
    setShowSearch(false);
  }, [pathname]);

  // Focus search input when search overlay triggers & add Escape key listener
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
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

  // Handle Functional Search Submission (Redirects to /adventure?search=query)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    setShowSearch(false);
    setSearchQuery("");
    router.push(`/adventure?search=${encodeURIComponent(query)}`);
  };

  const handlePopularSearch = (term) => {
    setShowSearch(false);
    setSearchQuery("");
    router.push(`/adventure?search=${encodeURIComponent(term)}`);
  };

  const whatsappUrl = siteConfig.contact.phone.whatsappUrl || "https://wa.me/8801898334722";

  // Translucent glassmorphic tokens that dynamically contract when scrolled
  const dockWrapperClass = scrolled
    ? "top-3 sm:top-4 py-2 sm:py-2.5 px-5 sm:px-6 bg-white/90 backdrop-blur-lg border-primary/12 shadow-[0_12px_40px_rgba(13,35,30,0.08)]"
    : "top-4 sm:top-6 py-3 sm:py-3.5 px-6 sm:px-8 bg-light/85 backdrop-blur-lg border-primary/8 shadow-[0_8px_30px_rgba(13,35,30,0.04)]";

  return (
    <>
      {/* 1. SUSPENDED FLOATING NAVIGATION DOCK */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-[999] w-[92%] sm:w-[90%] max-w-7xl rounded-2xl border transition-all duration-500 ease-out font-body text-primary ${dockWrapperClass}`}>
        
        {/* DESKTOP: 3 EQUAL SECTIONS GRID TO PLACE NAV EXACTLY IN THE MIDDLE */}
        <nav className="hidden lg:grid grid-cols-3 items-center w-full h-9 sm:h-11">
          
          {/* SECTION 1 (LEFT): LOGO */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center" aria-label="Royal Safari Tours Logo">
              <Image
                loading="eager"
                src={royal_logo}
                alt="Royal Safari Tours"
                priority
                className="h-7 sm:h-8 md:h-11 w-auto object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* SECTION 2 (CENTER): MAIN NAVIGATION ITEMS */}
          <div className="flex items-center justify-center">
            <ul className="flex items-center gap-6 xl:gap-8 text-[13px] font-semibold tracking-[0.25em] uppercase font-body">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.id} className="relative group py-2">
                    <Link
                      href={item.path}
                      className={`transition-colors duration-300 hover:text-accent ${
                        isActive ? "text-accent font-bold" : "text-primary/80"
                      }`}
                    >
                      {item.name}
                    </Link>
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent transition-all duration-300 origin-center ${
                      isActive ? "w-4 scale-x-100" : "w-0 scale-x-0 group-hover:w-4 group-hover:scale-x-100"
                    }`} />
                  </li>
                );
              })}
              {isAdmin && (
                <li className="relative group py-2">
                  <Link
                    href="/dashboard"
                    className={`transition-colors duration-300 hover:text-accent ${
                      pathname === "/dashboard" ? "text-accent font-bold" : "text-primary/80"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent transition-all duration-300 origin-center ${
                    pathname === "/dashboard" ? "w-4 scale-x-100" : "w-0 scale-x-0 group-hover:w-4 group-hover:scale-x-100"
                  }`} />
                </li>
              )}
            </ul>
          </div>

          {/* SECTION 3 (RIGHT): SEARCH & WHATSAPP CHAT NOW BUTTON */}
          <div className="flex items-center justify-end gap-4 xl:gap-5">
            {/* Minimal outline Search trigger */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-1 hover:text-accent transition-colors cursor-pointer flex items-center justify-center text-primary/80"
              aria-label="Toggle site search"
            >
              <Icon icon="lucide:search" width="16" height="16" />
            </button>

            {/* WhatsApp Chat Now Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-primary hover:bg-secondary hover:scale-[1.02] text-white text-[11px] tracking-[0.15em] font-bold py-2.5 px-4 sm:px-5 rounded-full transition-all duration-300 uppercase cursor-pointer shadow-xs flex items-center gap-2 font-body"
            >
              <Icon icon="akar-icons:whatsapp-fill" className="w-4 h-4 text-white" />
              <span>Chat Now</span>
            </a>
          </div>

        </nav>

        {/* MOBILE & TABLET LAYOUT */}
        <nav className="flex lg:hidden items-center justify-between w-full h-9 sm:h-11 font-body">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Royal Safari Tours Logo">
            <Image
              loading="eager"
              src={royal_logo}
              alt="Royal Safari Tours"
              priority
              className="h-7 sm:h-8 md:h-10 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Right Action Button: ONLY Hamburger Menu Toggle */}
          <div className="flex items-center justify-end font-body">
            <button
              onClick={() => setIsShowNav((prev) => !prev)}
              className="flex items-center justify-center p-1.5 text-primary hover:text-accent transition-colors cursor-pointer z-50"
              aria-expanded={isShowNav}
              aria-label="Toggle drawer menu"
            >
              <Icon
                icon={isShowNav ? "lucide:x" : "lucide:menu"}
                width="24"
                height="24"
              />
            </button>
          </div>
        </nav>

      </header>

      {/* 2. DYNAMIC RESPONSIVE SPOTLIGHT SEARCH POPUP OVERLAY */}
      <div 
        className={`fixed inset-0 z-[1010] bg-primary/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          showSearch ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSearch(false)}
      />

      <div className={`fixed top-[10%] sm:top-[18%] left-1/2 -translate-x-1/2 z-[1015] w-[92%] sm:w-[90%] max-w-2xl bg-sand border border-primary/15 rounded-3xl shadow-2xl transition-all duration-300 ease-out transform p-5 sm:p-7 ${
        showSearch ? "translate-y-0 scale-100 opacity-100" : "-translate-y-6 scale-95 opacity-0 pointer-events-none"
      }`}>
        
        {/* Popup Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-accent uppercase font-body">
            SEARCH EXPEDITIONS & TOURS
          </span>
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 rounded-full bg-gray-200/60 text-primary hover:bg-accent hover:text-white transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 pt-4 pb-2">
          <Icon icon="lucide:search" width="22" height="22" className="text-secondary flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Where do you want to go? (e.g. Sajek, Sundarbans)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-primary font-body text-sm sm:text-base font-medium placeholder:text-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 hover:text-rose-500 transition-colors text-gray-400 flex items-center justify-center cursor-pointer"
              aria-label="Clear text"
            >
              <Icon icon="lucide:x-circle" width="18" height="18" />
            </button>
          )}
          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer font-body uppercase tracking-wider shadow-xs flex-shrink-0"
          >
            Search
          </button>
        </form>
        
        {/* Quick Popular Search Tags */}
        <div className="pt-4 border-t border-gray-200/80 text-left">
          <span className="text-[10px] font-bold tracking-widest text-primary/50 uppercase block mb-2 font-body">
            Popular Destinations
          </span>
          <div className="flex flex-wrap gap-2">
            {["Sajek Valley", "Sundarbans", "Cox's Bazar", "Sylhet", "Bandarban", "Nepal"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handlePopularSearch(term)}
                className="text-[11px] sm:text-xs text-primary bg-white hover:bg-secondary hover:text-white border border-gray-200 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-body font-medium"
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

      {/* Screen-Fit Navdrawer Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-[1001] h-[100dvh] max-h-[100dvh] w-[280px] sm:w-[320px] bg-sand text-primary shadow-2xl p-5 sm:p-6 border-l border-gray-200 transition-transform duration-500 ease-out transform font-body flex flex-col justify-between overflow-hidden ${
          isShowNav ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between font-body overflow-hidden">
          
          {/* Top Header - Logo & Close */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/80 font-body shrink-0">
            <Image
              loading="eager"
              src={royal_logo}
              alt="Royal Safari Tours"
              className="h-7 sm:h-8 w-auto object-contain"
            />
            <button
              onClick={() => setIsShowNav(false)}
              className="p-1.5 rounded-full hover:bg-primary/10 text-primary hover:text-accent transition-colors cursor-pointer"
              aria-label="Close menu drawer"
            >
              <Icon icon="lucide:x" width="20" height="20" />
            </button>
          </div>

          {/* Search Trigger Inside Drawer */}
          <button
            type="button"
            onClick={() => {
              setIsShowNav(false);
              setShowSearch(true);
            }}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-primary/70 text-xs font-medium cursor-pointer shadow-xs my-3 hover:border-secondary transition-colors font-body shrink-0"
          >
            <span className="flex items-center gap-2">
              <Icon icon="lucide:search" className="w-4 h-4 text-secondary" />
              <span>Search Expeditions...</span>
            </span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Search</span>
          </button>

          {/* Middle Navigation Links - Fits Viewport Height */}
          <div className="flex-1 flex flex-col justify-center overflow-y-auto py-2 font-body my-auto">
            <ul className="flex flex-col gap-2 font-body">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      onClick={() => setIsShowNav(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 font-body ${
                        isActive
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "text-primary hover:text-secondary hover:bg-primary/5"
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && <Icon icon="lucide:chevron-right" className="w-4 h-4 text-accent" />}
                    </Link>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsShowNav(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 font-body ${
                      pathname === "/dashboard"
                        ? "bg-primary text-white font-bold shadow-xs"
                        : "text-primary hover:text-secondary hover:bg-primary/5"
                    }`}
                  >
                    <span>Dashboard</span>
                    <Icon icon="lucide:layout-dashboard" className="w-4 h-4 text-accent" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Bottom Chat Now Button - Always Visible Without Scrolling */}
          <div className="pt-3 border-t border-gray-200/80 font-body shrink-0 mt-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-primary hover:bg-secondary text-white font-bold transition-all duration-300 text-xs text-center uppercase tracking-widest shadow-xs cursor-pointer font-body"
            >
              <Icon icon="akar-icons:whatsapp-fill" className="w-4 h-4 text-white" />
              <span>Chat Now</span>
            </a>
          </div>

        </div>
      </div>
    </>
  );
}

