"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Land", "Water", "Mountain", "Wildlife", "Cycling", "Culture"];

const discoveryTiles = [
  {
    id: "safari",
    category: "Wildlife",
    title: "Deep Sundarbans Tiger Safari",
    location: "Sundarbans Mangrove",
    duration: "4 Days",
    price: "$250",
    image: "/images/banners/camping.webp",
    isLarge: true,
  },
  {
    id: "hiking",
    category: "Land",
    title: "Sreemangal Tea Rainforest Trek",
    location: "Lawachara Forest",
    duration: "3 Days",
    price: "$185",
    image: "/images/banners/about.webp",
    isLarge: false,
  },
  {
    id: "rafting",
    category: "Water",
    title: "Bamboo Rafting & Waterfalls",
    location: "Bandarban Rivers",
    duration: "2 Days",
    price: "$158",
    image: "/images/banners/banner2.webp",
    isLarge: false,
  },
];

export default function AdventureDiscovery() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredTiles =
    activeTab === "All"
      ? discoveryTiles
      : discoveryTiles.filter((item) => item.category === activeTab);

  const heroTile = filteredTiles.find((t) => t.isLarge) || filteredTiles[0];
  const sideTiles = filteredTiles.filter((t) => t._id !== heroTile?.id && !t.isLarge);

  return (
    <section id="adventure-explorer" className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E]">
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            Curated Interests
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
            What Kind of Adventure <br className="hidden sm:block" />
            Are You Looking For?
          </h2>
          <p className="text-sm sm:text-base text-[#0D231E]/70 font-light font-inter">
            Filter our hand-crafted wilderness experiences by domain, from mountain ridge climbs to coastal mangrove boat rides.
          </p>
        </div>

        {/* Horizontal Category Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-100 overflow-x-auto pb-4 mb-10 sm:mb-14 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 pb-2 border-b-2 shrink-0 cursor-pointer ${
                activeTab === cat
                  ? "border-[#DE8D3D] text-[#0D231E]"
                  : "border-transparent text-[#0D231E]/50 hover:text-[#0D231E]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Editorial Gallery (1 Large + 2 Supporting Tiles) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          
          {/* Large Hero Tile (8 Cols) */}
          {heroTile && (
            <Link
              href={`/adventure?category=${encodeURIComponent(heroTile.category)}`}
              className="lg:col-span-8 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_8px_30px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_50px_rgba(13,35,30,0.12)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-end p-6 sm:p-10"
            >
              <Image
                src={heroTile.image}
                alt={heroTile.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              <div className="relative z-10 space-y-3 text-white max-w-xl transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#0D231E]/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/20">
                    {heroTile.category}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-playfair text-2xl sm:text-4xl font-bold tracking-wide text-white">
                  {heroTile.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-white/80 font-inter">
                  <span className="flex items-center gap-1">
                    <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-[#DE8D3D]" />
                    {heroTile.location}
                  </span>
                  <span>•</span>
                  <span>{heroTile.duration}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-white">{heroTile.price}</span>
                </div>
              </div>
            </Link>
          )}

          {/* 2 Supporting Side Tiles (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 justify-between">
            {sideTiles.map((tile) => (
              <Link
                key={tile.id}
                href={`/adventure?category=${encodeURIComponent(tile.category)}`}
                className="group relative rounded-3xl overflow-hidden min-h-[220px] bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_6px_25px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_45px_rgba(13,35,30,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-end p-6 flex-1"
              >
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="relative z-10 space-y-1.5 text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#DE8D3D] uppercase">
                    <span>{tile.category}</span>
                    <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-white">
                    {tile.title}
                  </h4>
                  <p className="text-xs text-white/70 font-inter">
                    {tile.location} • {tile.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
