"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/animations";

// Extensible service categories configuration
const SERVICES = [
  { id: "adventures", label: "Adventures", icon: "lucide:palmtree", badge: null },

];

export default function Hero() {
  const router = useRouter();

  // Active Service Tab
  const [activeTab, setActiveTab] = useState("adventures");

  // Locations state
  const [locations, setLocations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("Cox's Bazar");
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const locDropdownRef = useRef(null);

  // Date state & ref
  const [travelDate, setTravelDate] = useState("2026-09-10");
  const dateInputRef = useRef(null);

  const fallbackLocations = [
    { country: "Cox's Bazar" },
    { country: "Sundarbans" },
    { country: "Sreemangal" },
    { country: "Sajek Valley" },
    { country: "Sylhet" },
  ];

  // Fetch locations from backend API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/tour-location");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLocations(data);
            if (data[0]?.country) {
              setSelectedDestination(data[0].country);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch tour locations:", err);
      }
    };
    fetchLocations();
  }, []);

  // Close custom location dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locDropdownRef.current && !locDropdownRef.current.contains(e.target)) {
        setIsLocDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLocations = locations.length > 0 ? locations : fallbackLocations;

  const handleScrollDown = () => {
    const nextSection = document.getElementById("featured-destinations");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/adventure?destination=${encodeURIComponent(selectedDestination)}&date=${encodeURIComponent(travelDate)}`
    );
  };

  // Open native calendar picker on date card click
  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  // Format date display
  const formatDateDisplay = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { dayNum: "10", monthName: "September 2026", dayWeek: "Wednesday" };
      const dayNum = String(d.getDate()).padStart(2, "0");
      const monthName = `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getFullYear()}`;
      const dayWeek = d.toLocaleDateString("en-US", { weekday: "long" });
      return { dayNum, monthName, dayWeek };
    } catch {
      return { dayNum: "10", monthName: "September 2026", dayWeek: "Wednesday" };
    }
  };

  const formattedDate = formatDateDisplay(travelDate);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center section-hero overflow-hidden bg-[url('/images/banners/home_hero.webp')] bg-fixed bg-cover bg-center font-body pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/75 to-light/30 sm:via-light/65 sm:to-transparent z-0" />

      {/* Main Centered Content */}
      <div className="relative z-10 container mx-auto w-full flex flex-col items-center text-center">
        
        {/* Centered Headline Copy */}
        <Reveal variant="fadeUp" className="max-w-3xl mx-auto mb-8 sm:mb-10 text-primary text-center">
          <SectionHeading
            subtitle="ROYAL SAFARI TOURS"
            title={
              <>
                Where Wilderness Meets <br />
                <span className="italic font-normal text-accent font-heading">
                  Unmatched Luxury
                </span>
              </>
            }
            description="Explore extraordinary wilderness journeys across Bangladesh's pristine sanctuaries and tea valleys."
            level="h1"
            align="center"
            className="mb-4 text-primary"
            subtitleClassName="text-accent font-bold tracking-[0.25em]"
            descriptionClassName="text-body-lg text-primary/80 max-w-xl mx-auto leading-relaxed"
          />
        </Reveal>

        {/* Centered Search Card Widget */}
        <Reveal variant="scaleUp" delay={0.15} className="w-full max-w-3xl mx-auto relative mb-6">
          <div className="bg-white/98 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(13,35,30,0.12)] border border-gray-100 text-primary text-left relative pb-10 sm:pb-12">
            
            {/* 1. EXTENSIBLE SERVICE TABS BAR */}
            <div className="flex items-center gap-4 sm:gap-6 pb-3 mb-5 overflow-x-auto scrollbar-none font-body">
              {SERVICES.map((service) => {
                const isActive = activeTab === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveTab(service.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer rounded-xl ${
                      isActive
                        ? "text-[#DE8D3D] bg-[#DE8D3D]/10"
                        : "text-primary/70 hover:text-primary hover:bg-gray-100/80"
                    }`}
                  >
                    <Icon icon={service.icon} className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-[#DE8D3D]" : "text-primary/60"}`} />
                    <span>{service.label}</span>

                    {/* Active Indicator Underline */}
                    {isActive && (
                      <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#DE8D3D] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. COMPACT EQUAL SIZED LOCATION & CALENDAR DATE SEARCH BOXES */}
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-center">
                
                {/* COMPACT EQUAL BOX 1: CUSTOM LOCATION DROPDOWN */}
                <div ref={locDropdownRef} className="relative">
                  <div
                    onClick={() => setIsLocDropdownOpen((prev) => !prev)}
                    className="bg-white border-2 border-gray-200 hover:border-secondary transition-all rounded-2xl py-2.5 px-4 shadow-xs flex items-center gap-3.5 group cursor-pointer h-16"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary group-hover:bg-secondary/10 group-hover:text-secondary transition-colors flex items-center justify-center font-bold text-sm shrink-0">
                      <Icon icon="lucide:map-pin" className="w-5 h-5 text-secondary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                        Destination
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm sm:text-base font-bold text-primary truncate capitalize">
                          {selectedDestination}
                        </span>
                        <Icon icon="lucide:chevron-down" className={`w-4 h-4 text-gray-400 group-hover:text-secondary transition-transform duration-300 shrink-0 ml-2 ${isLocDropdownOpen ? "rotate-180 text-secondary" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM FLOATING POPOVER DROPDOWN MENU */}
                  {isLocDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 font-body max-h-60 overflow-y-auto">
                      {displayLocations.map((loc, idx) => {
                        const locName = loc.country.charAt(0).toUpperCase() + loc.country.slice(1);
                        const isSelected = selectedDestination.toLowerCase() === loc.country.toLowerCase();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedDestination(loc.country);
                              setIsLocDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-secondary/10 text-secondary font-bold"
                                : "text-primary hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Icon icon="lucide:map-pin" className={`w-4 h-4 ${isSelected ? "text-secondary" : "text-gray-400"}`} />
                              <span>{locName}</span>
                            </span>
                            {isSelected && <Icon icon="lucide:check" className="w-4 h-4 text-secondary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* COMPACT EQUAL BOX 2: WORKING CALENDAR DATE PICKER */}
                <div
                  onClick={handleOpenCalendar}
                  className="bg-white border-2 border-gray-200 hover:border-secondary transition-all rounded-2xl py-2.5 px-4 shadow-xs flex items-center gap-3.5 group cursor-pointer h-16 relative"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors flex items-center justify-center font-bold text-sm shrink-0">
                    <Icon icon="lucide:calendar" className="w-5 h-5 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                      Travel Date
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-sm sm:text-base font-bold text-primary truncate">
                        {formattedDate.dayNum} {formattedDate.monthName}
                      </span>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline truncate">
                        ({formattedDate.dayWeek})
                      </span>
                    </div>
                  </div>

                  <Icon icon="lucide:calendar-days" className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors shrink-0 ml-2" />

                  {/* Invisible HTML5 Native Date Picker Overlay */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                </div>

              </div>

              {/* 3. FLOATING CENTERED SEARCH BUTTON (OVERLAPPING BOTTOM BORDER) */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20">
                <button
                  type="submit"
                  className="bg-[#DE8D3D] hover:bg-[#c97b2e] text-white font-bold text-sm px-8 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(222,141,61,0.4)] hover:shadow-[0_15px_30px_rgba(222,141,61,0.5)] hover:scale-105 transition-all cursor-pointer font-body uppercase tracking-wider"
                >
                  <Icon icon="lucide:search" className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </form>

          </div>
        </Reveal>

      </div>

      {/* Centered Bottom Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1 cursor-pointer text-primary/60 hover:text-accent transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold font-accent">
            Scroll to explore
          </span>
          <Icon icon="lucide:chevron-down" width="16" height="16" className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
