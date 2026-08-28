"use client";

import Button from "@/components/Button";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/animations";

export default function TourHero({ tourPackage, onOpenBooking, onOpenGallery }) {
  if (!tourPackage) return null;

  // Gather all photos: featured image + galleryImages + itinerary day images
  const featured = tourPackage.featuredImage || tourPackage.image;
  const galleryImgs = Array.isArray(tourPackage.galleryImages) ? tourPackage.galleryImages : [];
  const itineraryImgs = (tourPackage.itinerary || []).map((day) => day.image).filter(Boolean);

  const rawPhotos = [featured, ...galleryImgs, ...itineraryImgs].filter(Boolean);
  const photos = Array.from(new Set(rawPhotos)).map((img) =>
    img.startsWith("/") || img.startsWith("http")
      ? img
      : `/api/uploads/tour-packages/${img}`
  );

  if (photos.length === 0) {
    photos.push("/images/placeholder.jpg");
  }

  // Active photo state (index)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const hotelRating = Number(tourPackage.hotelRating || tourPackage.rating || 3);
  const regularPrice = Number(tourPackage.price) || 0;
  const discountPrice = tourPackage.discountPrice ? Number(tourPackage.discountPrice) : null;
  const transportation = tourPackage.transportation || [];

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I am interested in booking: "${tourPackage.title}". Please share details.`
  );

  const cleanDescriptionSnippet = (tourPackage.description || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>?/gm, "");

  const activePhotoUrl = photos[activePhotoIndex] || photos[0];

  return (
    <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-white border-b border-gray-100 font-body">
      <div className="container">
        {/* Minimal Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-gray-500 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/adventure" className="hover:text-primary transition-colors">
            Tours
          </Link>
          {tourPackage.location && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{tourPackage.location}</span>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-primary font-semibold truncate max-w-[200px] sm:max-w-none">
            {tourPackage.title}
          </span>
        </nav>

        {/* Two-Column Premium Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-body">
          {/* Left (7 Cols): Main Photography + Gallery Thumbnails Strip (Matching User Screenshot) */}
          <Reveal variant="fadeRight" className="lg:col-span-7 space-y-4 font-body">
            {/* 1. Main Display Featured Photo Box */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-sm border border-gray-200/80 bg-sand group">
              <Image
                src={activePhotoUrl}
                alt={tourPackage.title || "Tour Package Photography"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Top Left: Location Badge */}
              {tourPackage.location && (
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xs font-body">
                  <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                  <span>{tourPackage.location}</span>
                </div>
              )}

              {/* Top Right Action Buttons (Share & Favorite Icons like in Screenshot) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Tour link copied to clipboard!");
                  }}
                  className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                  title="Share Tour"
                >
                  <Icon icon="lucide:share-2" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => alert("Added to favorites!")}
                  className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                  title="Favorite"
                >
                  <Icon icon="lucide:heart" className="w-4 h-4 text-rose-400" />
                </button>
              </div>

              {/* Bottom Right: Open Fullscreen Gallery Lightbox */}
              <button
                onClick={() => onOpenGallery(activePhotoIndex)}
                className="absolute bottom-4 right-4 z-10 bg-black/60 hover:bg-primary backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 shadow-xs hover:scale-105 transition-all cursor-pointer font-body"
              >
                <Icon icon="lucide:camera" className="w-4 h-4 text-accent" />
                <span>View Full Gallery ({photos.length})</span>
              </button>
            </div>

            {/* 2. Interactive Photo Gallery Thumbnails Strip (Directly Beneath Main Photo - Matching Screenshot) */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none font-body">
                {photos.map((photo, idx) => {
                  const isActive = idx === activePhotoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative aspect-[4/3] w-24 sm:w-28 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer shadow-xs ${
                        isActive
                          ? "border-secondary ring-2 ring-secondary/40 scale-102"
                          : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={photo}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </Reveal>

          {/* Right (5 Cols): Information & Booking Panel */}
          <Reveal variant="fadeLeft" className="lg:col-span-5 space-y-6 font-body">
            {/* Category Tag & Hotel Rating Badge */}
            <div className="space-y-3 font-body">
              <div className="flex items-center justify-between">
                <span className="text-xs font-accent font-bold tracking-[0.25em] text-accent uppercase">
                  CURATED EXPEDITION
                </span>
                <div className="flex items-center gap-1.5 bg-sand border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-primary font-body">
                  <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-amber-500" />
                  <span>{hotelRating} Star Accommodation</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary leading-tight">
                {tourPackage.title}
              </h1>
            </div>

            {/* Top Key Info Strip: Transportation, Location, Accommodation */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-xs font-body">
              <div className="flex flex-col truncate">
                <span className="text-[10px] uppercase font-bold text-gray-400">Transportation</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5 truncate">
                  <Icon icon="lucide:car" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{transportation.join(" / ") || "Private Transport"}</span>
                </span>
              </div>

              <div className="flex flex-col truncate">
                <span className="text-[10px] uppercase font-bold text-gray-400">Location</span>
                <span className="font-semibold text-primary flex items-center gap-1 mt-0.5 truncate">
                  <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{tourPackage.location || "Nepal"}</span>
                </span>
              </div>

              <div className="flex flex-col truncate">
                <span className="text-[10px] uppercase font-bold text-gray-400">Accommodation</span>
                <span className="font-semibold text-primary flex items-center gap-1 mt-0.5 truncate">
                  <Icon icon="lucide:building-2" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{hotelRating} Star Hotel</span>
                </span>
              </div>
            </div>

            {/* Description Snippet (first 2 lines) */}
            {cleanDescriptionSnippet && (
              <p className="text-body-sm text-gray-600 font-light leading-relaxed font-body line-clamp-2">
                {cleanDescriptionSnippet}
              </p>
            )}

            {/* Pricing Section */}
            <div className="pt-2 space-y-1 font-body">
              <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400 block">
                Total Price Per Guest
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-primary font-heading">
                  ৳{(discountPrice || regularPrice).toLocaleString()}
                </span>
                {discountPrice && (
                  <span className="text-base line-through text-gray-400">
                    ৳{regularPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  / per person
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 font-body">
              <Button
                onClick={onOpenBooking}
                variant="primary"
                className="w-full"
                icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
              >
                Book This Tour
              </Button>

              <Button
                href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                className="w-full"
                icon={<Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-whatsapp" />}
              >
                Chat on WhatsApp (+8801898-334733)
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
