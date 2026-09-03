"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TourGalleryModal({ tourPackage, isOpen, onClose, activeIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  // Generate gallery images array using package image + curated tour photography
  const galleryImages = [
    tourPackage?.image?.startsWith("/")
      ? tourPackage.image
      : `/api/uploads/tour-packages/${tourPackage?.image}`,
    "/images/banners/travel_inspiration.webp",
    "/images/banners/about_hero.webp",
    "/images/banners/contact_hero.webp",
  ].filter(Boolean);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, galleryImages.length]);

  if (!isOpen || galleryImages.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Close Lightbox"
      >
        <Icon icon="lucide:x" className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Previous Image"
      >
        <Icon icon="lucide:chevron-left" className="w-6 h-6" />
      </button>

      {/* Main Lightbox Image */}
      <div className="relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={galleryImages[currentIndex]}
          alt={`Gallery Image ${currentIndex + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 font-subheading">
          {currentIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Next Image"
      >
        <Icon icon="lucide:chevron-right" className="w-6 h-6" />
      </button>
    </div>
  );
}
