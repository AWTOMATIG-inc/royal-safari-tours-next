"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef } from "react";

export default function TourItineraryCards({ itinerary = [] }) {
  const sliderRef = useRef(null);

  if (!itinerary || itinerary.length === 0) return null;

  // Use slider whenever there are more than 2 items, or on mobile devices
  const isSlider = itinerary.length > 2;

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  return (
    <div className="space-y-6 font-body">
      {/* Header Row with Navigation Slider Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          subtitle="DAY-BY-DAY EXPEDITION ROUTE"
          title="Itinerary Breakdown"
        />

        {/* Slider Navigation Buttons */}
        {isSlider && (
          <div className="flex items-center gap-2 shrink-0 pb-2 sm:pb-0 font-body">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0D231E] hover:text-white hover:border-[#0D231E] text-gray-700 flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
              title="Previous Itinerary Day"
            >
              <Icon icon="lucide:chevron-left" className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-[#0D231E] hover:text-white hover:border-[#0D231E] text-gray-700 flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
              title="Next Itinerary Day"
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
            ? "flex items-center gap-6 overflow-x-auto snap-x snap-mandatory py-2 px-1"
            : itinerary.length === 1
            ? "grid grid-cols-1 gap-6"
            : "grid grid-cols-1 sm:grid-cols-2 gap-6"
        }`}
      >
        {itinerary.map((day, idx) => {
          const bgUrl =
            day.image ||
            `/images/hero/hero_banner_${(idx % 2) + 1}.png`;

          return (
            <div
              key={idx}
              className={`group relative aspect-[9/12] rounded-3xl overflow-hidden bg-sand border border-gray-200 shadow-sm hover:shadow-xl transition-transform transition-colors duration-300 transform-gpu cursor-pointer font-body ${
                isSlider
                  ? "w-[85vw] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
                  : "w-full"
              }`}
            >
              {/* Background Image */}
              <Image
                src={bgUrl}
                alt={day.title || day.dayName}
                fill
                sizes="(max-width: 640px) 85vw, 340px"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300" />

              {/* Top Day Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#0D231E]/95 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full tracking-wider font-body shadow-xs">
                  {day.dayName || `Day ${idx + 1}`}
                </span>
              </div>

              {/* Default Bottom State: Title */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white font-body group-hover:opacity-0 transition-opacity duration-300">
                <h4 className="text-lg font-bold text-white font-heading line-clamp-2 leading-snug">
                  {day.title}
                </h4>
                <p className="text-[11px] text-accent mt-1 flex items-center gap-1 font-medium">
                  <span>Tap/Hover for Details</span>
                  <Icon icon="lucide:arrow-right" className="w-3 h-3" />
                </p>
              </div>

              {/* Hover / Tap Revealed Full Description Overlay */}
              <div className="absolute inset-0 bg-[#0D231E]/95 p-6 z-20 text-white font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3">
                  <span className="inline-block bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-body">
                    {day.dayName || `Day ${idx + 1}`}
                  </span>

                  <h4 className="text-base sm:text-lg font-bold text-white font-heading leading-snug">
                    {day.title}
                  </h4>

                  {day.description && (
                    <p className="text-xs text-gray-200 leading-relaxed font-light font-body">
                      {day.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
