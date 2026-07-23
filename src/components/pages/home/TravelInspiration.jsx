"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const destinationItems = [
  {
    id: 1,
    title: "Sundarbans Tiger Reserve",
    category: "Mangrove Safaris",
    location: "Khulna Region",
    image: "/images/banners/camping.webp",
    duration: "4 Days",
    tag: "UNESCO Sanctuary",
    description: "Deep jungle boat safaris, Royal Bengal tiger tracking, and river twilight stillness.",
  },
  {
    id: 2,
    title: "Sreemangal Tea Estates",
    category: "Tea Valleys",
    location: "Sylhet Division",
    image: "/images/banners/about.webp",
    duration: "3 Days",
    tag: "Boutique Eco-Lodge",
    description: "Organic tea garden trails, Lawachara rainforest treks, and artisanal tea tasting.",
  },
  {
    id: 3,
    title: "Cox's Bazar Long Coast",
    category: "Coastal Seas",
    location: "Bay of Bengal",
    image: "/images/banners/banner2.webp",
    duration: "3 Days",
    tag: "Unbroken Ocean Front",
    description: "Private beachside dining, coastal cruises, and natural sea horizon sunsets.",
  },
  {
    id: 4,
    title: "Sajek Valley Cloud Ridge",
    category: "Cloud Valleys",
    location: "Chittagong Hill Tracts",
    image: "/images/banners/contact_hero.jpg",
    duration: "3 Days",
    tag: "Peak Ridge Stay",
    description: "Watch morning cloud seas roll over bamboo forest ridges in executive comfort.",
  },
  {
    id: 5,
    title: "Ratargul Swamp Forest",
    category: "Mangrove Safaris",
    location: "Sylhet Division",
    image: "/images/banners/banner1.webp",
    duration: "2 Days",
    tag: "Freshwater Sanctuary",
    description: "Glide silently on small wooden boats through South Asia's premier freshwater swamp.",
  },
  {
    id: 6,
    title: "Tanguar Haor Wetland",
    category: "Tea Valleys",
    location: "Sunamganj",
    image: "/images/banners/footer-banner.webp",
    duration: "3 Days",
    tag: "Houseboat Living",
    description: "Luxury premium houseboat cruises across pristine crystal water mirrors.",
  },
];

const categories = ["All Regions", "Mangrove Safaris", "Tea Valleys", "Coastal Seas", "Cloud Valleys"];

export default function TravelInspiration() {
  const [activeCategory, setActiveCategory] = useState("All Regions");

  const filteredItems =
    activeCategory === "All Regions"
      ? destinationItems
      : destinationItems.filter((item) => item.category === activeCategory);

  return (
    <section className="relative w-full bg-black text-white font-body">
      {/* 1. Fixed Parallax Hero Inspiration Banner */}
      <div className="relative py-24 sm:py-32 md:py-40 overflow-hidden bg-[url('/images/banners/memories.webp')] bg-fixed bg-cover bg-center text-center">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-primary/75 backdrop-blur-xs" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-3xl space-y-6 sm:space-y-8">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent inline-block font-accent">
            Travel Inspiration
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal italic leading-tight text-white/95">
            &ldquo;In every walk with nature, <br className="hidden sm:block" />
            one receives far more than he seeks.&rdquo;
          </h2>

          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/60 font-body">
            — John Muir
          </p>
        </div>
      </div>

      {/* 2. Interactive Destination Filter Section */}
      <div className="section-md bg-sand text-primary">
        <div className="container">
          
          {/* Header */}
          <SectionHeading
            subtitle="Explore By Experience"
            title="Discover Regions by Category"
            description="Select your sanctuary type to filter hand-crafted expeditions."
            align="center"
            className="mb-10 sm:mb-12"
          />

          {/* Responsive Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-14 font-body">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white text-primary/80 border border-gray-200 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filtered Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-secondary/40 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden font-body">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/20">
                      {item.tag}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 font-body">
                    <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-accent uppercase">
                      <span>{item.location}</span>
                      <span className="flex items-center gap-1 text-primary/60 font-normal">
                        <Icon icon="lucide:clock" className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                    </div>

                    <h4 className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-primary/70 font-light font-body line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 font-body">
                  <Link
                    href={`/adventure?destination=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-sand border border-primary/15 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 text-[11px] font-semibold tracking-wider uppercase text-primary shadow-xs"
                  >
                    <span>View Region</span>
                    <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

