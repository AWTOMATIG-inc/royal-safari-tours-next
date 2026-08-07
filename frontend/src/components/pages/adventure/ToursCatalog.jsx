"use client";

import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/TourCard";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { RevealGroup } from "@/components/animations";

export default function ToursCatalog({
  initialTourPackages = [],
  locations = [],
  searchQuery = "",
  setSearchQuery,
  selectedLocation = "all",
  setSelectedLocation,
}) {
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract all unique destination names dynamically from locations & tour packages
  const destinationList = useMemo(() => {
    const locMap = new Map();

    // 1. From database tour locations
    locations.forEach((loc) => {
      const name = loc.country || loc.title || loc.name;
      if (name && typeof name === "string") {
        const trimmed = name.trim();
        if (trimmed && !locMap.has(trimmed.toLowerCase())) {
          locMap.set(trimmed.toLowerCase(), trimmed);
        }
      }
    });

    // 2. From actual tour package locations in database
    initialTourPackages.forEach((tour) => {
      if (tour.location && typeof tour.location === "string") {
        const trimmed = tour.location.trim();
        if (trimmed && !locMap.has(trimmed.toLowerCase())) {
          locMap.set(trimmed.toLowerCase(), trimmed);
        }
      }
    });

    return Array.from(locMap.values());
  }, [locations, initialTourPackages]);

  // Filter & Sort Logic
  const filteredTours = useMemo(() => {
    let result = [...initialTourPackages];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(q) ||
          tour.location?.toLowerCase().includes(q) ||
          tour.description?.toLowerCase().includes(q)
      );
    }

    // 2. Location Filter
    if (selectedLocation && selectedLocation !== "all") {
      const targetLoc = selectedLocation.toLowerCase().trim();
      result = result.filter((tour) => {
        if (!tour.location) return false;
        const tourLoc = tour.location.toLowerCase().trim();
        return tourLoc === targetLoc || tourLoc.includes(targetLoc) || targetLoc.includes(tourLoc);
      });
    }

    // 3. Price Filter
    if (priceRange !== "all") {
      result = result.filter((tour) => {
        const price = Number(tour.price) || 0;
        if (priceRange === "under-5000") return price <= 5000;
        if (priceRange === "5000-15000") return price > 5000 && price <= 15000;
        if (priceRange === "15000-30000") return price > 15000 && price <= 30000;
        if (priceRange === "above-30000") return price > 30000;
        return true;
      });
    }

    // 4. Rating Filter
    if (minRating > 0) {
      result = result.filter((tour) => (Number(tour.rating) || 0) >= minRating);
    }

    // 5. Sort
    result.sort((a, b) => {
      if (sortBy === "price-low") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === "price-high") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [initialTourPackages, searchQuery, selectedLocation, priceRange, minRating, sortBy]);

  // Reset Filters
  const handleReset = () => {
    if (setSearchQuery) setSearchQuery("");
    if (setSelectedLocation) setSelectedLocation("all");
    setPriceRange("all");
    setMinRating(0);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedLocation !== "all" ||
    priceRange !== "all" ||
    minRating > 0;

  // Reusable Filter Sidebar Content
  const FilterContent = (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
        <h3 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
          <Icon icon="lucide:sliders-horizontal" className="w-5 h-5 text-secondary" />
          Filter Expeditions
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer flex items-center gap-1 font-body"
          >
            <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-2 font-body">
        <label className="text-[11px] font-bold text-primary/70 uppercase tracking-widest block font-body">
          Search Expeditions
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search title, place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-body text-primary placeholder:text-gray-400 focus:outline-none focus:border-secondary transition-all duration-300 shadow-xs"
          />
          <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 cursor-pointer"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Destination / Location Filter */}
      <div className="space-y-2 border-t border-gray-200/80 pt-5 font-body">
        <label className="text-[11px] font-bold text-primary/70 uppercase tracking-widest block font-body">
          Destinations
        </label>
        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedLocation && setSelectedLocation("all")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-body transition-all duration-300 cursor-pointer border ${
              selectedLocation === "all"
                ? "bg-primary text-white border-primary font-semibold shadow-xs"
                : "bg-white border-gray-200 text-gray-700 hover:border-secondary hover:text-primary"
            }`}
          >
            <span className="flex items-center gap-2 font-body">
              <Icon icon="lucide:globe" className="w-3.5 h-3.5 text-accent" />
              All Destinations
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10">
              {initialTourPackages.length}
            </span>
          </button>

          {destinationList.map((locName) => {
            const count = initialTourPackages.filter((t) => {
              if (!t.location) return false;
              const tourLoc = t.location.toLowerCase().trim();
              const targetLoc = locName.toLowerCase().trim();
              return tourLoc === targetLoc || tourLoc.includes(targetLoc) || targetLoc.includes(tourLoc);
            }).length;

            const isSelected = selectedLocation?.toLowerCase() === locName.toLowerCase();

            return (
              <button
                key={locName}
                onClick={() => setSelectedLocation && setSelectedLocation(locName)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-body transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-white border-primary font-semibold shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:border-secondary hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2 truncate font-body">
                  <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                  {locName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Filter */}
      <div className="space-y-2 border-t border-gray-200/80 pt-5 font-body">
        <label className="text-[11px] font-bold text-primary/70 uppercase tracking-widest block font-body">
          Budget Range
        </label>
        <div className="grid grid-cols-1 gap-2 font-body">
          {[
            { id: "all", label: "All Budgets" },
            { id: "under-5000", label: "Under ৳5,000" },
            { id: "5000-15000", label: "৳5,000 - ৳15,000" },
            { id: "15000-30000", label: "৳15,000 - ৳30,000" },
            { id: "above-30000", label: "Above ৳30,000" },
          ].map((range) => {
            const isSelected = priceRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setPriceRange(range.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-body transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-secondary/10 border-secondary text-primary font-bold shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:border-secondary"
                }`}
              >
                <span>{range.label}</span>
                {isSelected && (
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-secondary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Minimum Rating Filter */}
      <div className="space-y-2 border-t border-gray-200/80 pt-5 font-body">
        <label className="text-[11px] font-bold text-primary/70 uppercase tracking-widest block font-body">
          Minimum Rating
        </label>
        <div className="flex flex-wrap gap-2 font-body">
          {[
            { rating: 0, label: "Any" },
            { rating: 4.0, label: "4.0★+" },
            { rating: 4.5, label: "4.5★+" },
          ].map((r) => {
            const isSelected = minRating === r.rating;
            return (
              <button
                key={r.rating}
                type="button"
                onClick={() => setMinRating(r.rating)}
                className={`px-3.5 py-2 rounded-xl text-xs font-body font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:border-accent"
                }`}
              >
                {r.rating > 0 && <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-white" />}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section id="tours-catalog" className="container py-12 sm:py-16 font-body">
      
      {/* Catalog Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-gray-200/80 font-body">
        <SectionHeading
          subtitle="CURATED CATALOG"
          title={
            <span className="flex items-center gap-3">
              Available Expeditions
              <span className="text-xs font-body font-bold px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 shadow-xs">
                {filteredTours.length} {filteredTours.length === 1 ? "Tour" : "Tours"}
              </span>
            </span>
          }
        />

        {/* Controls: Mobile Filter Toggle & Sort Selector */}
        <div className="flex items-center gap-3 font-body">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-semibold text-primary font-body cursor-pointer shadow-xs hover:border-secondary"
          >
            <Icon icon="lucide:sliders-horizontal" className="w-4 h-4 text-secondary" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-2xl px-4 py-2.5 text-xs font-body text-primary shadow-xs">
            <Icon icon="lucide:arrow-up-down" className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-primary font-bold focus:outline-none cursor-pointer font-body"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-6 font-body">
          <span className="text-xs text-gray-400 font-medium mr-1 font-body">Filters Active:</span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-xs font-body">
              Keyword: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery && setSearchQuery("")} className="hover:text-accent cursor-pointer ml-1">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedLocation !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-xs font-body">
              Location: {selectedLocation}
              <button onClick={() => setSelectedLocation && setSelectedLocation("all")} className="hover:text-accent cursor-pointer ml-1">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {priceRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-xs font-body">
              Price: {priceRange}
              <button onClick={() => setPriceRange("all")} className="hover:text-accent cursor-pointer ml-1">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-xs font-body">
              Rating: {minRating}★+
              <button onClick={() => setMinRating(0)} className="hover:text-accent cursor-pointer ml-1">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={handleReset}
            className="text-xs font-bold text-accent hover:underline cursor-pointer ml-2 font-body"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 font-body">

        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-sand border border-gray-200/90 rounded-3xl p-6 shadow-xs">
          {FilterContent}
        </aside>

        {/* MOBILE FILTER DRAWER */}
        {isMobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-[1005] flex">
            {/* Backdrop Blur Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Left Drawer Panel */}
            <div className="relative mr-auto w-[85%] max-w-xs sm:max-w-sm bg-sand h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 border-r border-gray-200/90 font-body">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                  <h3 className="font-heading text-xl font-bold text-primary">
                    Filter Expeditions
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-full bg-gray-200/60 text-primary hover:bg-accent hover:text-white transition-colors cursor-pointer"
                    aria-label="Close filters drawer"
                  >
                    <Icon icon="lucide:x" className="w-5 h-5" />
                  </button>
                </div>
                {FilterContent}
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider font-body cursor-pointer transition-colors shadow-xs"
                >
                  Show Results ({filteredTours.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT MAIN: TOUR CARDS GRID */}
        <main className="lg:col-span-9 w-full font-body">
          {filteredTours.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <RevealGroup.Item key={tour._id || tour.slug}>
                  <TourCard tour_package={tour} />
                </RevealGroup.Item>
              ))}
            </RevealGroup>
          ) : (
            <div className="bg-sand border border-gray-200/90 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-xs font-body">
              <div className="w-16 h-16 rounded-full bg-primary/5 text-accent flex items-center justify-center mx-auto">
                <Icon icon="lucide:search-x" className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary">
                No Expeditions Match Your Search
              </h3>
              <p className="text-xs text-gray-500 font-body font-light leading-relaxed">
                We couldn&apos;t find any tours matching your exact filters. Try clearing your search keyword or selecting a different location.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors cursor-pointer font-body shadow-xs"
              >
                <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </main>

      </div>

    </section>
  );
}

