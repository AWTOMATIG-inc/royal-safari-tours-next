"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import { useRef } from "react";

export default function TourHotelsSection({ hotels = [], hotelRating = 3 }) {
  const sliderRef = useRef(null);

  if (!hotels || hotels.length === 0) return null;

  // Use slider whenever there are more than 2 items
  const isSlider = hotels.length > 2;

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header Row with Navigation Slider Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          subtitle="ACCOMMODATIONS & STAY"
          title="Accomodation"
          description={`Selected ${hotelRating} Star accommodations prepared for your expedition.`}
        />

        {/* Slider Navigation Buttons */}
        {isSlider && (
          <div className="flex items-center gap-2 shrink-0 pb-2 sm:pb-0 font-body">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0D231E] hover:text-white hover:border-[#0D231E] text-gray-700 flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
              title="Previous Hotel"
            >
              <Icon icon="lucide:chevron-left" className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0D231E] hover:text-white hover:border-[#0D231E] text-gray-700 flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
              title="Next Hotel"
            >
              <Icon icon="lucide:chevron-right" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Container: Single-line Horizontal Slider when > 2 items, Grid when 1-2 items */}
      <div
        ref={sliderRef}
        className={`font-body scrollbar-none transition-all duration-300 ${
          isSlider
            ? "flex items-center gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-1"
            : hotels.length === 1
            ? "grid grid-cols-1 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 gap-4"
        }`}
      >
        {hotels.map((h, idx) => (
          <div
            key={idx}
            className={`bg-sand/60 border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4 font-body hover:border-secondary/30 transition-colors ${
              isSlider
                ? "w-[84vw] sm:w-[300px] md:w-[320px] shrink-0 snap-start"
                : "w-full"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D231E] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon icon="lucide:building-2" className="w-6 h-6 text-accent" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary font-body block truncate">
                📍 {h.city}
              </span>
              <h5 className="text-sm font-bold text-primary font-heading truncate">
                {h.hotelName}
              </h5>
              <p className="text-[11px] text-gray-500 font-body font-light truncate">
                {hotelRating} Star Accommodation Included
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
