"use client";

import AdventureHero from "./AdventureHero";
import ToursCatalog from "./ToursCatalog";
import ContactNewsletter from "../contact/ContactNewsletter";
import { useMemo, useState } from "react";

export default function AdventureClientPage({ tourPackages = [], locations = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

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
