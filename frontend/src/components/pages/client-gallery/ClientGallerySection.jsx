"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientGallerySection({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Construct absolute URL helper
  const getImageUrl = (pathStr) => {
    if (!pathStr) return "/images/placeholder.jpg";
    if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
      return pathStr;
    }
    if (pathStr.startsWith("/uploads/")) {
      return `${API_BASE}${pathStr}`;
    }
    if (pathStr.startsWith("/api/uploads/")) {
      return pathStr;
    }
    return `/api/uploads/gallery/${pathStr}`;
  };

  // Unique list of destinations
  const destinations = [
    "All",
    ...Array.from(new Set(items.map((item) => item.destination).filter(Boolean))),
  ];

  // Filter items by destination
  const filteredItems = items.filter((item) => {
    if (selectedDestination === "All") return true;
    return item.destination === selectedDestination;
  });

  // Lightbox Navigation Controls
  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery-grid-section" className="container py-12 sm:py-16 md:py-20 font-body">
      {/* Destination Filter Tabs */}
      {destinations.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 font-body">
          {destinations.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDestination(dest)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                selectedDestination === dest
                  ? "bg-[#0D231E] text-white shadow-md scale-105"
                  : "bg-sand/80 text-primary/70 hover:bg-sand hover:text-primary border border-primary/5"
              }`}
            >
              {dest === "All" ? "All Expeditions" : dest}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-sand/50 rounded-3xl border border-primary/10 space-y-3 font-body">
          <Icon icon="lucide:camera-off" className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="text-base font-bold text-[#0D231E]">No Moments Found</h4>
          <p className="text-xs text-gray-500">Check back soon for new traveler photos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 font-body">
          {filteredItems.map((item, idx) => (
            <div key={item.id || idx}>
              <div
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand shadow-xs border border-primary/10 cursor-pointer"
              >
                <Image
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title || "Traveler story"}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-white font-body">
                  {/* Destination Tag */}
                  <div className="self-start">
                    {item.destination && (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/20">
                        📍 {item.destination}
                      </span>
                    )}
                  </div>

                  {/* Title & Zoom Icon */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-heading line-clamp-1 group-hover:text-accent transition-colors">
                        {item.title}
                      </h4>
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Icon icon="lucide:maximize-2" className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    {item.caption && (
                      <p className="text-xs text-white/80 line-clamp-1 font-light">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-body animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <Icon icon="lucide:x" className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Previous (Left Arrow)"
            >
              <Icon icon="lucide:chevron-left" className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Next (Right Arrow)"
            >
              <Icon icon="lucide:chevron-right" className="w-6 h-6" />
            </button>
          )}

          {/* Modal Card */}
          <div className="relative max-w-4xl w-full bg-[#0D231E] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Image Box */}
            <div className="relative w-full md:w-2/3 aspect-[4/3] md:aspect-auto min-h-[300px] bg-black flex items-center justify-center">
              <Image
                src={getImageUrl(activeItem.imageUrl)}
                alt={activeItem.title || "Gallery preview"}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Content Details Box */}
            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between text-white space-y-4 font-body border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
              <div className="space-y-4">
                {activeItem.destination && (
                  <span className="inline-block bg-[#2cb775]/20 text-[#2cb775] border border-[#2cb775]/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    📍 {activeItem.destination}
                  </span>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  {activeItem.title}
                </h3>

                {activeItem.caption && (
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                    "{activeItem.caption}"
                  </p>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-body">
                <span>
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <Link
                  href="/adventure"
                  className="text-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Explore Tours</span>
                  <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
