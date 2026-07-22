"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import Rating from "./Rating";

export default function TourCard({
  tour_package,
  showPrice = true,
  showLink = true,
  imageHeightClass = "aspect-[4/3]",
  ratingColor = "text-accent",
}) {
  if (!tour_package) return null;

  const imageUrl = tour_package.image?.startsWith("/")
    ? tour_package.image
    : `/api/uploads/tour-packages/${tour_package.image}`;

  const linkHref = tour_package.slug ? `/packages/${tour_package.slug}` : "#";
  const numRating = Number(tour_package.rating) || 5;

  const CardImage = (
    <div className={`relative w-full ${imageHeightClass} overflow-hidden bg-lightGray`}>
      <Image
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        src={imageUrl}
        alt={tour_package.title || "Tour Expedition"}
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Top Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

      {/* Top Left: Location Badge */}
      {tour_package.location && (
        <div className="absolute top-3.5 left-3.5 z-10 bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm font-subheading">
          <Icon icon="lucide:map-pin" className="w-3 h-3 text-accent" />
          <span>{tour_package.location}</span>
        </div>
      )}

      {/* Top Right: Rating Pill */}
      <div className="absolute top-3.5 right-3.5 z-10 bg-white/95 backdrop-blur-md text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 font-subheading border border-gray-100">
        <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-accent" />
        <span>{numRating.toFixed(1)}</span>
      </div>

      {/* Bottom Left Badge: Special Offer / Discount */}
      {tour_package.priceOff && (
        <div className="absolute bottom-3.5 left-3.5 z-10 bg-accent text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-md font-subheading">
          Special Offer
        </div>
      )}
    </div>
  );

  return (
    <div className="group relative bg-sand rounded-3xl border border-gray-200/90 overflow-hidden shadow-[0_4px_20px_rgba(13,35,30,0.06)] hover:shadow-[0_20px_40px_rgba(13,35,30,0.14)] hover:border-secondary/40 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full">
      <div>
        {showLink && tour_package.slug ? (
          <Link href={linkHref} className="block cursor-pointer">
            {CardImage}
          </Link>
        ) : (
          CardImage
        )}

        {/* Card Content Area */}
        <div className="p-5 space-y-3">
          
          {/* Title & Star Rating Bar */}
          <div className="space-y-1">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
              {tour_package.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <Rating rating={numRating} className={`${ratingColor} w-3.5 h-3.5`} />
              <span className="text-[11px] text-gray-500 font-body font-medium">
                ({numRating.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Package Description snippet if available */}
          {tour_package.description && (
            <p className="text-xs text-gray-600 font-body font-light line-clamp-2 leading-relaxed">
              {tour_package.description.replace(/<[^>]*>?/gm, '')}
            </p>
          )}

        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-gray-200/70 mt-auto bg-lightGray/40">
        {showPrice && tour_package.price != null ? (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-subheading">
              Starting From
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary font-body">
                ৳{Number(tour_package.price).toLocaleString()}
              </span>

              {tour_package.priceOff && (
                <span className="text-xs line-through text-gray-400 font-body">
                  ৳{Number(tour_package.priceOff).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div />
        )}

        {showLink && tour_package.slug && (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1.5 bg-primary group-hover:bg-secondary text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm font-subheading group/btn"
          >
            <span>View Tour</span>
            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
