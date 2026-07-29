"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import FinalBookingCTA from "./FinalBookingCTA";
import QuickPackageInfo from "./QuickPackageInfo";
import StickyBookingBar from "./StickyBookingBar";
import TourAdditionalInfo from "./TourAdditionalInfo";
import TourGalleryModal from "./TourGalleryModal";
import TourGallerySection from "./TourGallerySection";
import TourHero from "./TourHero";
import TourInclusionsExclusions from "./TourInclusionsExclusions";
import TourOverview from "./TourOverview";
import TourReviews from "./TourReviews";

export default function TourDetailsClientPage({ tourPackage }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleOpenGalleryAt = (index = 0) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Immersive Two-Column Tour Hero */}
      <TourHero
        tourPackage={tourPackage}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenGallery={() => handleOpenGalleryAt(0)}
      />

      {/* 2. Sticky Booking Bar (Desktop Floating / Mobile Fixed Bottom) */}
      <StickyBookingBar
        tourPackage={tourPackage}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* 3. Quick Package Highlights Strip */}
      <QuickPackageInfo tourPackage={tourPackage} />

      {/* 4. Editorial Overview ("About This Experience") */}
      <TourOverview tourPackage={tourPackage} />

      {/* 5. Inclusions & Exclusions Grid */}
      <TourInclusionsExclusions tourPackage={tourPackage} />

      {/* 6. Good to Know & Additional Info Accordion */}
      <TourAdditionalInfo tourPackage={tourPackage} />

      {/* 7. Expedition Photo Gallery */}
      <TourGallerySection
        tourPackage={tourPackage}
        onOpenGalleryAt={handleOpenGalleryAt}
      />

      {/* 8. Guest Reviews */}
      <TourReviews tourPackage={tourPackage} />

      {/* 9. Final Conversion Booking CTA */}
      <FinalBookingCTA
        tourPackage={tourPackage}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Modals & Lightbox Overlays */}
      <BookingModal
        tourPackage={tourPackage}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <TourGalleryModal
        tourPackage={tourPackage}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        activeIndex={galleryIndex}
      />
    </main>
  );
}
