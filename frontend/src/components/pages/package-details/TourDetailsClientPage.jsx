"use client";

import Button from "@/components/Button";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FinalBookingCTA from "./FinalBookingCTA";
import QuickPackageInfo from "./QuickPackageInfo";
import TourAdditionalInfo from "./TourAdditionalInfo";
import TourGalleryModal from "./TourGalleryModal";
import TourHero from "./TourHero";
import TourHotelsSection from "./TourHotelsSection";
import TourInclusionsExclusions from "./TourInclusionsExclusions";
import TourItineraryCards from "./TourItineraryCards";
import TourOverview from "./TourOverview";
import StickyBookingBar from "./StickyBookingBar";

export default function TourDetailsClientPage({ tourPackage }) {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  const handleGuestDecrement = () => setGuestCount((prev) => Math.max(1, prev - 1));
  const handleGuestIncrement = () => setGuestCount((prev) => Math.min(99, prev + 1));

  if (!tourPackage) return null;

  const handleOpenGalleryAt = (index = 0) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleNavigateToCheckout = () => {
    const pkgSlug = tourPackage.slug || tourPackage.id;
    const query = new URLSearchParams({
      package: pkgSlug,
      guests: String(guestCount || 1),
      date: selectedDate || "",
    });
    router.push(`/checkout?${query.toString()}`);
  };

  const hotelRating = Number(tourPackage.hotelRating || tourPackage.rating || 3);
  const regularPrice = Number(tourPackage.price) || 0;
  const discountPrice = tourPackage.discountPrice ? Number(tourPackage.discountPrice) : null;
  const unitPrice = discountPrice || regularPrice;
  const transportation = tourPackage.transportation || [];

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I am interested in booking: "${tourPackage.title}". Please share details.`
  );

  return (
    <main className="min-h-screen bg-white font-body">
      {/* 1. Interactive Hero Photography Gallery Banner (Matching Screenshot Layout) */}
      <TourHero
        tourPackage={tourPackage}
        onOpenBooking={handleNavigateToCheckout}
        onOpenGallery={(idx) => handleOpenGalleryAt(idx || 0)}
      />

      {/* 2. Quick Package Highlights Strip */}
      <QuickPackageInfo tourPackage={tourPackage} />

      {/* 3. Main Content Grid (8-col Left Main Content + 4-col Right Sidebar) */}
      <div className="py-12 sm:py-16 bg-white font-body">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-body">
            
            {/* LEFT COLUMN (8-cols): Main Tour Content */}
            <div className="lg:col-span-8 space-y-12 font-body">
              {/* Tour Overview */}
              <TourOverview tourPackage={tourPackage} />

              {/* Day-by-Day Interactive Itinerary Cards */}
              {tourPackage.itinerary?.length > 0 && (
                <TourItineraryCards itinerary={tourPackage.itinerary} />
              )}

              {/* Hotels Breakdown */}
              {tourPackage.hotels?.length > 0 && (
                <TourHotelsSection hotels={tourPackage.hotels} hotelRating={hotelRating} />
              )}

              {/* Inclusions & Exclusions */}
              <TourInclusionsExclusions tourPackage={tourPackage} />

              {/* Good to Know / Additional Info */}
              <TourAdditionalInfo tourPackage={tourPackage} />

              {/* Guest Reviews 
              <TourReviews tourPackage={tourPackage} />*/}
            </div>

            {/* RIGHT SIDEBAR COLUMN (4-cols): Sticky Pricing & Booking Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6 font-body">
              {/* Booking Card Box */}
              <div className="bg-sand/70 border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 font-body">
                <div className="space-y-2 pb-2 font-body">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-secondary font-body">
                    PRICE PER GUEST
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary font-heading">
                      ৳{(discountPrice || regularPrice).toLocaleString()}
                    </span>
                    {discountPrice && (
                      <span className="text-base line-through text-gray-400">
                        ৳{regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-light block">
                    All Taxes & Fees Included
                  </span>
                </div>

                {/* Date Selection Box */}
                <div className="space-y-1.5 pt-2 font-body">
                  <label className="text-xs font-bold text-primary flex items-center justify-between font-body">
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:calendar-days" className="w-4 h-4 text-secondary" />
                      Start Date
                    </span>
                    <span className="text-[11px] font-normal text-gray-400">Select Date</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-body text-primary focus:outline-none focus:border-secondary shadow-2xs cursor-pointer"
                  />
                </div>

                {/* Persons / Guests Selector Box */}
                <div className="space-y-1.5 pt-3 font-body">
                  <div className="flex items-center justify-between font-body">
                    <div>
                      <h5 className="text-xs font-bold text-primary flex items-center gap-1.5 font-body">
                        <Icon icon="lucide:users" className="w-4 h-4 text-secondary" />
                        Adult / Guests
                      </h5>
                      <p className="text-[11px] text-accent font-semibold font-body mt-0.5">
                        ৳{(discountPrice || regularPrice).toLocaleString()} per person
                      </p>
                    </div>

                    {/* Counter Buttons (- 1 +) */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1 shadow-2xs font-body">
                      <button
                        type="button"
                        onClick={handleGuestDecrement}
                        disabled={guestCount <= 1}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-primary flex items-center justify-center transition-colors cursor-pointer font-bold"
                      >
                        <Icon icon="lucide:minus" className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-primary w-4 text-center font-body">
                        {guestCount}
                      </span>
                      <button
                        type="button"
                        onClick={handleGuestIncrement}
                        disabled={guestCount >= 99}
                        className="w-7 h-7 rounded-lg bg-[#0D231E] hover:bg-[#2cb775] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer font-bold"
                      >
                        <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Price Summary Row (Left: Total Label, Right: Total Amount) */}
                <div className="flex items-center justify-between pt-3.5 border-t border-gray-200 font-body">
                  <div>
                    <h5 className="text-lg font-bold text-primary font-heading">Total</h5>
                    <span className="text-[11px] text-gray-500 font-light block">
                      ({guestCount} {guestCount === 1 ? "Guest" : "Guests"})
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary font-heading">
                    ৳{(unitPrice * guestCount).toLocaleString()}
                  </span>
                </div>

                {/* Booking CTA Buttons */}
                <div className="space-y-3 pt-2 font-body">
                  <Button
                    onClick={handleNavigateToCheckout}
                    variant="primary"
                    className="w-full justify-center text-sm py-3.5 cursor-pointer"
                    icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Support & Expert Inquiry Widget */}
              <div className="bg-[#0D231E] text-white rounded-3xl p-6 shadow-md space-y-3 font-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Icon icon="lucide:headphones" className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white font-heading">Need Travel Advice?</h5>
                    <p className="text-[11px] text-gray-300">Speak directly with our safari specialists.</p>
                  </div>
                </div>
                <a
                  href={`tel:${siteConfig.contact.phone.primaryRaw}`}
                  className="block text-center w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors font-body"
                >
                  Call {siteConfig.contact.phone.primary}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Bottom Full-Width Reservation Banner */}
      <FinalBookingCTA
        tourPackage={tourPackage}
        onOpenBooking={handleNavigateToCheckout}
      />
      {/* 6. High-Res Photo Gallery Lightbox Modal */}
      <TourGalleryModal
        tourPackage={tourPackage}
        isOpen={isGalleryOpen}
        initialIndex={galleryIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </main>
  );
}
