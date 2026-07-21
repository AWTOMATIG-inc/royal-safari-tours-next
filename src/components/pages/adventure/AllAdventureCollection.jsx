"use client";

import { adventureCollections } from "@/constants/adventure_collection";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const filterCategories = ["All", "Water", "Land", "Mountain"];

export default function AllAdventureCollection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const filtered = adventureCollections.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Water") {
      return ["Boating", "Rafting", "Kayaking", "Canyoning", "Canoe"].some((k) =>
        item.title.includes(k)
      );
    }
    if (activeCategory === "Mountain") {
      return ["Mountain", "Climbing", "Hills", "Canyon"].some((k) =>
        item.title.includes(k)
      );
    }
    if (activeCategory === "Land") {
      return ["Camping", "Hiking", "Horse", "Cycling", "Riding"].some((k) =>
        item.title.includes(k)
      );
    }
    return true;
  });

  const sortedList = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
    return 0;
  });

  return (
    <section id="all-adventures" className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E]">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
              Complete Catalog
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
              Explore All Adventures
            </h2>
            <p className="text-sm text-[#0D231E]/70 font-light font-inter max-w-md">
              Filter by terrain or activity type to choose your next wilderness experience.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold tracking-wider uppercase text-[#0D231E]/60 font-inter">
              Sort By:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f8f6f0] border border-[#e8e4d8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#0D231E] uppercase font-inter focus:outline-none focus:border-[#2cb775] appearance-none pr-9 cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <Icon icon="lucide:chevron-down" className="w-4 h-4 text-[#0D231E]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#0D231E] text-white shadow-md"
                  : "bg-[#f0ece1] text-[#0D231E]/80 border border-[#e2ddd0] hover:bg-[#e6e1d3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedList.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_6px_25px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_45px_rgba(13,35,30,0.12)] hover:border-[#2cb775]/40 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Image (4:3 Aspect Ratio) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0D231E] font-mono font-bold text-xs shadow-sm border border-[#e8e4d8]">
                    ${item.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#DE8D3D]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Icon key={i} icon="lucide:star" className="w-3.5 h-3.5 fill-[#DE8D3D]" />
                      ))}
                      <span className="text-xs font-bold font-inter text-[#0D231E] ml-1">
                        4.9
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-[#0D231E]/60 tracking-wider">
                      Expedition
                    </span>
                  </div>

                  <h4 className="font-playfair text-lg font-bold text-[#0D231E] group-hover:text-[#2cb775] transition-colors leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <Link
                  href={`/adventure?activity=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-white border border-[#dcd6c5] group-hover:bg-[#0D231E] group-hover:text-white group-hover:border-[#0D231E] transition-all duration-300 text-[11px] font-semibold tracking-wider uppercase text-[#0D231E] shadow-sm"
                >
                  <span>Explore Activity</span>
                  <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
