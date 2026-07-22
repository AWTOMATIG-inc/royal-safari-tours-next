"use client";

import Rating from "@/components/Rating";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export default function TourHero({ tourPackage, onOpenBooking, onOpenGallery }) {
  if (!tourPackage) return null;

  const imageUrl = tourPackage.image?.startsWith("/")
    ? tourPackage.image
    : `/api/uploads/tour-packages/${tourPackage.image}`;

  const numRating = Number(tourPackage.rating) || 5;

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I am interested in booking: "${tourPackage.title}". Please share details.`
  );

  return (
    <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        
        {/* Minimal Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-subheading text-gray-500 mb-6 sm:mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-subheading">
          
          {/* Left (7 Cols): Cinematic Large Tour Photography */}
          <div className="lg:col-span-7 relative group">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(13,35,30,0.1)] border border-gray-200/80 bg-gray-100">
              <Image
                src={imageUrl}
                alt={tourPackage.title || "Tour Package Photography"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Top Left: Location Badge */}
              {tourPackage.location && (
                <div className="absolute top-4 left-4 z-10 bg-black/55 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                  <span>{tourPackage.location}</span>
                </div>
              )}

              {/* Bottom Right: View Gallery Button */}
              <button
                onClick={onOpenGallery}
                className="absolute bottom-4 right-4 z-10 bg-black/60 hover:bg-primary backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Icon icon="lucide:camera" className="w-4 h-4 text-accent" />
                <span>View Photos</span>
              </button>
            </div>
          </div>

          {/* Right (5 Cols): Information & Booking Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category Tag & Rating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mansalva font-bold tracking-[0.25em] text-accent uppercase">
                  CURATED EXPEDITION
                </span>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-accent" />
                  <span>{numRating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">(Verified)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary leading-tight">
                {tourPackage.title}
              </h1>

              {/* Rating Bar */}
              <div className="flex items-center gap-3 pt-1">
                <Rating rating={numRating} className="text-accent w-4 h-4" />
                <span className="text-xs text-gray-500 font-medium">
                  {numRating >= 4.8 ? "Exceptional" : "Highly Rated"} Expedition
                </span>
              </div>
            </div>

            {/* Key Info Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Duration</span>
                <span className="font-semibold text-primary flex items-center gap-1 mt-0.5">
                  <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-secondary" />
                  {tourPackage.duration}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Location</span>
                <span className="font-semibold text-primary flex items-center gap-1 mt-0.5 truncate">
                  <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                  {tourPackage.location || "Bangladesh"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Group Type</span>
                <span className="font-semibold text-primary flex items-center gap-1 mt-0.5">
                  <Icon icon="lucide:users" className="w-3.5 h-3.5 text-primary" />
                  Small Group
                </span>
              </div>
            </div>

            {/* Short Description */}
            {tourPackage.shortDescription && (
              <p className="text-xs sm:text-sm text-gray-600 font-body font-light leading-relaxed">
                {tourPackage.shortDescription}
              </p>
            )}

            {/* Pricing Section */}
            <div className="pt-2 space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400 block">
                Total Price Per Guest
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  ৳{Number(tourPackage.price).toLocaleString()}
                </span>
                {tourPackage.priceOff && (
                  <span className="text-base line-through text-gray-400">
                    ৳{Number(tourPackage.priceOff).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  / per person
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wider uppercase cursor-pointer shadow-md hover:-translate-y-0.5"
              >
                <span>Book This Tour</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-primary font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-emerald-500" />
                <span>Chat on WhatsApp (+8801898-334733)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
