"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const featuredList = [
  {
    id: "f1",
    type: "High Altitude Expedition",
    title: "Sajek Cloud Peaks & Bamboo Ridge Trek",
    location: "Chittagong Hill Tracts",
    duration: "3 Days / 2 Nights",
    price: "$210.00",
    image: "/images/banners/contact_hero.jpg",
    description: "Watch morning cloud seas roll over mountain ridge-lines in executive comfort with native hill tribe guides.",
    isPrimary: true,
  },
  {
    id: "f2",
    type: "Forest Sanctuary",
    title: "Ratargul Swamp Silent Canoe Ride",
    location: "Sylhet Water Forest",
    duration: "2 Days / 1 Night",
    price: "$140.00",
    image: "/images/banners/banner1.webp",
    description: "Glide silently on small wooden canoes through South Asia's premier freshwater swamp.",
    isPrimary: false,
  },
  {
    id: "f3",
    type: "Coastal Expedition",
    title: "Cox's Bazar Ocean & Cliff Trail",
    location: "Bay of Bengal Coast",
    duration: "3 Days / 2 Nights",
    price: "$180.00",
    image: "/images/banners/banner2.webp",
    description: "Private beachside dining, coastal ridge hikes, and natural sea horizon sunsets.",
    isPrimary: false,
  },
];

export default function FeaturedAdventures() {
  const primaryItem = featuredList.find((i) => i.isPrimary) || featuredList[0];
  const sideItems = featuredList.filter((i) => i.id !== primaryItem.id);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E] border-t border-gray-100">
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            Featured Expeditions
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
            Hand-Crafted Adventures, <br />
            <span className="italic font-normal">Unforgettable Memories</span>
          </h2>
        </div>

        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Primary Featured Item (7 Cols) */}
          {primaryItem && (
            <div className="lg:col-span-7 group relative rounded-3xl bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_8px_30px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_50px_rgba(13,35,30,0.12)] overflow-hidden transition-all duration-500 flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src={primaryItem.image}
                  alt={primaryItem.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0D231E]/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/20">
                  {primaryItem.type}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-[#DE8D3D] uppercase font-inter">
                  <span className="flex items-center gap-1.5">
                    <Icon icon="lucide:clock" className="w-4 h-4" />
                    {primaryItem.duration}
                  </span>
                  <span className="font-mono font-bold text-sm text-[#0D231E] bg-white px-3 py-1 rounded-full shadow-sm border border-[#e8e4d8]">
                    From {primaryItem.price}
                  </span>
                </div>

                <h3 className="font-playfair text-2xl sm:text-3xl font-bold leading-tight text-[#0D231E] group-hover:text-[#2cb775] transition-colors">
                  {primaryItem.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#0D231E]/75 font-light font-inter line-clamp-3">
                  {primaryItem.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/adventure?item=${primaryItem.id}`}
                    className="inline-flex items-center gap-2.5 bg-[#0D231E] hover:bg-[#2cb775] text-white font-semibold text-xs tracking-wider uppercase px-7 py-3.5 rounded-xl transition-all duration-300 shadow-sm"
                  >
                    <span>View Expedition Details</span>
                    <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Items (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {sideItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_6px_25px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_45px_rgba(13,35,30,0.1)] overflow-hidden transition-all duration-500 flex-1 flex flex-col justify-between p-6 sm:p-7"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#DE8D3D] uppercase">
                    <span>{item.type}</span>
                    <span className="font-mono text-[#0D231E]/80 font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#e8e4d8]">
                      {item.price}
                    </span>
                  </div>

                  <h4 className="font-playfair text-xl font-bold text-[#0D231E] group-hover:text-[#2cb775] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs leading-relaxed text-[#0D231E]/75 font-light font-inter line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/adventure?item=${item.id}`}
                    className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-white border border-[#dcd6c5] group-hover:bg-[#0D231E] group-hover:text-white transition-all duration-300 text-[11px] font-semibold tracking-wider uppercase text-[#0D231E] shadow-sm"
                  >
                    <span>Explore Experience</span>
                    <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Section Bottom CTA */}
        <div className="pt-12 text-center">
          <button
            onClick={() => {
              const collectionEl = document.getElementById("all-adventures");
              if (collectionEl) collectionEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 group cursor-pointer font-inter"
          >
            <span>Explore All Adventures</span>
            <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
