"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

export default function ClientGallerySection({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Reset pagination when destination changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDestination]);

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
  const filteredItems = useMemo(() => {
    if (selectedDestination === "All") return items;
    return items.filter((item) => item.destination === selectedDestination);
  }, [items, selectedDestination]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.getElementById("gallery-grid-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Lightbox Navigation Controls
  const activeItem = lightboxIndex !== null ? paginatedItems[lightboxIndex] : null;

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : paginatedItems.length - 1));
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev < paginatedItems.length - 1 ? prev + 1 : 0));
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
  }, [lightboxIndex, paginatedItems.length]);

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
        <div className="space-y-10 font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 font-body">
            {paginatedItems.map((item, idx) => (
              <div key={item.id || idx}>
                <div
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand shadow-xs border border-primary/10 cursor-pointer transform-gpu"
                >
                  <Image
                    src={getImageUrl(item.imageUrl)}
                    alt={item.title || "Traveler story"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white font-body">
                    {item.destination && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">
                        📍 {item.destination}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    {item.caption && (
                      <p className="text-[11px] text-gray-200 line-clamp-2 font-light mt-0.5">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Client Gallery Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200/80 font-body">
              <span className="text-xs text-gray-500 font-body">
                Showing <strong className="text-primary font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong>–
                <strong className="text-primary font-bold">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}
                </strong>{" "}
                of <strong className="text-primary font-bold">{filteredItems.length}</strong> moments
              </span>

              <div className="flex items-center gap-1.5 font-body">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-primary hover:border-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold font-body transition-all cursor-pointer border ${
                      currentPage === pageNum
                        ? "bg-[#0D231E] text-white border-[#0D231E] shadow-xs"
                        : "bg-white border-gray-200 text-gray-700 hover:border-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-primary hover:border-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      {activeItem && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in font-body">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <Icon icon="lucide:chevron-left" className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <Icon icon="lucide:chevron-right" className="w-6 h-6" />
          </button>

          {/* Lightbox Image Container */}
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(activeItem.imageUrl)}
                alt={activeItem.title || "Gallery moment"}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white space-y-1 font-body">
              {activeItem.destination && (
                <span className="text-xs font-accent text-accent uppercase tracking-widest block">
                  📍 {activeItem.destination}
                </span>
              )}
              <h3 className="text-lg sm:text-xl font-bold font-heading">{activeItem.title}</h3>
              {activeItem.caption && (
                <p className="text-xs text-gray-300 max-w-lg mx-auto font-light leading-relaxed">
                  {activeItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
