"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

export default function AdventureHero({
  locations = [],
  locationList = [],
  searchQuery = "",
  setSearchQuery,
  selectedLocation = "all",
  setSelectedLocation,
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const catalogEl = document.getElementById("tours-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex flex-col justify-between pt-28 pb-32 md:pt-36 md:pb-36 bg-black text-white overflow-visible">
      {/* Background Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/camping.webp"
          alt="Wilderness Adventure Sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradients overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />
      </div>

      {/* Main Hero Centered Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 text-center max-w-4xl space-y-4 sm:space-y-6 my-auto font-subheading">
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.25em] text-accent uppercase">
          <Icon icon="lucide:compass" className="w-4 h-4 text-accent" />
          ROYAL EXPEDITIONS & SAFARIS
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold leading-[1.05] tracking-tight text-white">
          Explore Extraordinary <br />
          <span className="italic font-normal text-accent font-heading">Wilderness Journeys</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/80 font-light font-body leading-relaxed max-w-2xl mx-auto">
          Hand-crafted luxury safaris, mangrove boat expeditions, and mountain treks across Bangladesh and beyond.
        </p>
      </div>

      {/* FLOATING SEARCH BAR AT THE MIDDLE BOTTOM OF HERO */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-5xl px-4 sm:px-6">
        <div className="bg-sand border border-gray-200/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(13,35,30,0.16)] p-4 sm:p-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center font-subheading"
          >
            {/* Field 1: Keyword Input */}
            <div className="sm:col-span-5 relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-secondary transition-colors">
              <Icon icon="lucide:search" className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-primary placeholder:text-gray-400 focus:outline-none font-body"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery && setSearchQuery("")}
                  className="text-gray-400 hover:text-rose-500 cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Field 2: Location Selector Dropdown */}
            <div className="sm:col-span-4 relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-secondary transition-colors">
              <Icon icon="lucide:map-pin" className="w-5 h-5 text-accent mr-2.5 flex-shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation && setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-primary focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">All Destinations</option>
                {locationList.map((locName) => (
                  <option key={locName} value={locName}>
                    {locName}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Search Action Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase cursor-pointer shadow-md"
              >
                <span>Find Tours</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
