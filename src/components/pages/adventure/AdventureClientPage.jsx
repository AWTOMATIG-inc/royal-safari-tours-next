"use client";

import AdventureHero from "./AdventureHero";
import ToursCatalog from "./ToursCatalog";
import ContactNewsletter from "../contact/ContactNewsletter";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function AdventureContent({ tourPackages = [], locations = [] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Sync state if URL query params change dynamically
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearchQuery(q);
    const loc = searchParams.get("location");
    if (loc !== null) setSelectedLocation(loc);
  }, [searchParams]);

  // Dynamically extract all unique location names from locations DB model & tour packages
  const locationList = useMemo(() => {
    const locMap = new Map();

    locations.forEach((loc) => {
      const name = loc.country || loc.title || loc.name;
      if (name && typeof name === "string") {
        const trimmed = name.trim();
        if (trimmed && !locMap.has(trimmed.toLowerCase())) {
          locMap.set(trimmed.toLowerCase(), trimmed);
        }
      }
    });

    tourPackages.forEach((tour) => {
      if (tour.location && typeof tour.location === "string") {
        const trimmed = tour.location.trim();
        if (trimmed && !locMap.has(trimmed.toLowerCase())) {
          locMap.set(trimmed.toLowerCase(), trimmed);
        }
      }
    });

    return Array.from(locMap.values());
  }, [locations, tourPackages]);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero with floating Search Bar at bottom center */}
      <AdventureHero
        locations={locations}
        locationList={locationList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Spacer for bottom overlapping search card */}
      <div className="h-16 sm:h-20" />

      {/* 2. Main Travel Product Catalog (Left Filter Sidebar + Right Tour Cards Grid) */}
      <ToursCatalog
        initialTourPackages={tourPackages}
        locations={locations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* 3. Bottom Dispatch / Newsletter bar */}
      <ContactNewsletter />
    </main>
  );
}

export default function AdventureClientPage(props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white py-40 text-center font-inter text-gray-400">Loading Expeditions...</div>}>
      <AdventureContent {...props} />
    </Suspense>
  );
}
