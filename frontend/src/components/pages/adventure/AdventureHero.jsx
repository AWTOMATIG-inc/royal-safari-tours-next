"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import { Reveal } from "@/components/animations";

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
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex flex-col justify-between section-hero bg-[url('/images/banners/camping.webp')] bg-fixed bg-cover bg-center text-white overflow-visible font-body">
      {/* Gradients overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 z-0" />

      {/* Main Hero Centered Content */}
      <div className="relative z-10 container mx-auto my-auto">
        <SectionHeading
          subtitle="EXPLORE OUR PACKAGES"
          title={
            <>
              Explore Extraordinary <br />
              <span className="italic font-normal text-accent font-heading">Wilderness Journeys</span>
            </>
          }
          description="Hand-crafted luxury safaris, mangrove boat expeditions, and mountain treks across Bangladesh and beyond."
          level="h1"
          align="center"
          dark
          descriptionClassName="text-body-lg text-white/85 max-w-2xl mx-auto"
        />
      </div>

      {/* FLOATING SEARCH BAR */}
      <Reveal variant="scaleUp" delay={0.25} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-5xl px-4 sm:px-6 font-body">
        <div className="bg-sand border border-gray-200/90 rounded-3xl shadow-xl p-4 sm:p-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center font-body"
          >
            {/* Field 1: Keyword Input */}
            <div className="sm:col-span-5 relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-secondary transition-colors shadow-xs">
              <Icon icon="lucide:search" className="w-5 h-5 text-gray-400 mr-2.5 shrink-0" />
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
            <div className="sm:col-span-4 relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-secondary transition-colors shadow-xs">
              <Icon icon="lucide:map-pin" className="w-5 h-5 text-accent mr-2.5 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation && setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-primary focus:outline-none cursor-pointer font-medium font-body"
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
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase cursor-pointer shadow-xs font-body"
              >
                <span>Find Tours</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

