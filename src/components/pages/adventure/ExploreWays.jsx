"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const wayCategories = [
  {
    id: "wild",
    title: "Feel the Wild",
    subtitle: "Deep forest tiger tracking & mangrove river quietness",
    image: "/images/banners/camping.webp",
    linkCategory: "Wildlife",
  },
  {
    id: "heights",
    title: "Chase the Heights",
    subtitle: "High mountain ridge climbs & cloud peak retreats",
    image: "/images/banners/contact_hero.jpg",
    linkCategory: "Mountain",
  },
  {
    id: "water",
    title: "Follow the Water",
    subtitle: "Freshwater swamp canoeing & bamboo river rafting",
    image: "/images/banners/banner1.webp",
    linkCategory: "Water",
  },
  {
    id: "ride",
    title: "Ride Further",
    subtitle: "Mountain bike trails & coastal horseback rides",
    image: "/images/banners/about.webp",
    linkCategory: "Cycling",
  },
  {
    id: "culture",
    title: "Discover Culture",
    subtitle: "Indigenous hill tribe tea tasting & village stays",
    image: "/images/banners/banner2.webp",
    linkCategory: "Culture",
  },
];

export default function ExploreWays() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[#0D231E] text-white overflow-hidden">
      <div className="container">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            Emotional Journey
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Choose Your Way <br />
            <span className="italic font-normal text-white/90">To Explore</span>
          </h2>
        </div>

        {/* 5 Full-Width Category Image Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {wayCategories.map((item) => (
            <Link
              key={item.id}
              href={`/adventure?category=${encodeURIComponent(item.linkCategory)}`}
              className="group relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] bg-black/40 border border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end p-6 sm:p-7"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Translucent Dark Gradient Reveal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Content */}
              <div className="relative z-10 space-y-2 text-white transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-[#DE8D3D]">
                    Experience Style
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-playfair text-2xl font-bold tracking-wide text-white">
                  {item.title}
                </h3>

                <p className="text-xs font-light text-white/80 font-inter leading-relaxed line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
