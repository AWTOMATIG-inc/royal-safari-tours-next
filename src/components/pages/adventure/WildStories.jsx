"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const wildStories = [
  {
    id: "s1",
    category: "Expedition Journal",
    title: "Tracking Bengal Tigers Through the Sundarbans Tidal Channels",
    excerpt: "An intimate record of a 4-day boat safari through undisturbed mangrove forests and ancient tiger trails.",
    image: "/images/banners/camping.webp",
    readTime: "6 min read",
    isPrimary: true,
  },
  {
    id: "s2",
    category: "Highland Field Notes",
    title: "Dawn Above the Clouds in Sajek Ridge",
    excerpt: "Watching morning cloud seas unfold across bamboo forest horizons in executive mountain comfort.",
    image: "/images/banners/contact_hero.jpg",
    readTime: "4 min read",
    isPrimary: false,
  },
  {
    id: "s3",
    category: "Waterways & Flora",
    title: "Gliding Through Ratargul Freshwater Swamp",
    excerpt: "Exploring South Asia's premier freshwater canopy forest on hand-carved wooden canoes.",
    image: "/images/banners/about.webp",
    readTime: "5 min read",
    isPrimary: false,
  },
];

export default function WildStories() {
  const primary = wildStories.find((s) => s.isPrimary) || wildStories[0];
  const secondary = wildStories.filter((s) => s.id !== primary.id);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E] border-t border-gray-100">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 space-y-3 sm:space-y-0">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
              Editorial Dispatches
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
              Stories From The Wild
            </h2>
          </div>

          <Link
            href="/about-us"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#0D231E] hover:text-[#DE8D3D] transition-colors group"
          >
            <span>Read All Journals</span>
            <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Story Layout (1 Primary + 2 Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Primary Story (7 Cols) */}
          {primary && (
            <div className="lg:col-span-7 group relative rounded-3xl bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_8px_30px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_50px_rgba(13,35,30,0.12)] overflow-hidden transition-all duration-500 flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src={primary.image}
                  alt={primary.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0D231E]/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/20">
                  {primary.category}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs text-[#DE8D3D] font-mono font-semibold uppercase">
                  {primary.readTime}
                </span>

                <h3 className="font-playfair text-2xl sm:text-3xl font-bold leading-tight text-[#0D231E] group-hover:text-[#2cb775] transition-colors">
                  {primary.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#0D231E]/75 font-light font-inter line-clamp-3">
                  {primary.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    href="/about-us"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0D231E] group-hover:text-[#2cb775] transition-colors font-inter"
                  >
                    <span>Read Journal Story</span>
                    <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 2 Side Stories (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {secondary.map((story) => (
              <div
                key={story.id}
                className="group relative rounded-3xl bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_6px_25px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_45px_rgba(13,35,30,0.1)] overflow-hidden transition-all duration-500 flex-1 flex flex-col justify-between p-6 sm:p-7"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#DE8D3D] uppercase">
                    <span>{story.category}</span>
                    <span className="font-mono text-[#0D231E]/60 text-[10px]">
                      {story.readTime}
                    </span>
                  </div>

                  <h4 className="font-playfair text-xl font-bold text-[#0D231E] group-hover:text-[#2cb775] transition-colors leading-snug">
                    {story.title}
                  </h4>

                  <p className="text-xs leading-relaxed text-[#0D231E]/75 font-light font-inter line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/about-us"
                    className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#0D231E] group-hover:text-[#2cb775] transition-colors font-inter"
                  >
                    <span>Read Story</span>
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
