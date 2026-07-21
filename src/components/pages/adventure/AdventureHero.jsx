"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const quickCategories = [
  { name: "Hiking", icon: "lucide:footprints" },
  { name: "Safari", icon: "lucide:compass" },
  { name: "Water", icon: "lucide:waves" },
  { name: "Mountain", icon: "lucide:mountain" },
  { name: "Cycling", icon: "lucide:bike" },
  { name: "Culture", icon: "lucide:sparkles" },
];

export default function AdventureHero() {
  const handleScrollDown = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-black text-white">
      {/* Background Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/camping.webp"
          alt="Wilderness Adventure Sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[12000ms] ease-out scale-105 hover:scale-100"
        />
        {/* Dark-to-transparent gradient strongest behind left copy */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:via-black/50 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#DE8D3D] uppercase font-inter">
              <Icon icon="lucide:compass" className="w-4 h-4 text-[#DE8D3D]" />
              EXPLORE THE EXTRAORDINARY
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-normal leading-[0.98] tracking-tight text-white">
              Find Your Next <br />
              <span className="italic font-normal text-white/90">Adventure</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 font-light font-inter leading-relaxed max-w-xl">
              Experience hand-crafted, low-impact luxury expeditions through Bangladesh&rsquo;s pristine mangroves, tea valleys, and mountain peaks.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={() => handleScrollDown("adventure-explorer")}
                className="flex items-center justify-center gap-2.5 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold px-7 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
              >
                <span>Explore Adventures</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 border border-white/30 hover:bg-white/10 text-white font-semibold px-7 py-4 rounded-xl backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm tracking-wider uppercase"
              >
                <span>Plan Your Trip</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Glass Discovery Panel */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end w-full">
            <div className="relative w-full max-w-md p-[1px] bg-gradient-to-tr from-white/15 to-white/35 backdrop-blur-2xl rounded-3xl shadow-2xl">
              <div className="bg-black/40 backdrop-blur-xl rounded-[23px] p-6 sm:p-7 space-y-4 border border-white/10">
                
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] font-bold text-[#DE8D3D] uppercase block">
                      Quick Selection
                    </span>
                    <h3 className="font-playfair text-lg font-bold text-white">
                      Explore by Experience
                    </h3>
                  </div>
                  <Icon icon="lucide:sliders-horizontal" className="w-5 h-5 text-[#2cb775]" />
                </div>

                {/* Quick Category Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {quickCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleScrollDown("adventure-collection")}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-[#2cb775] text-white/90 hover:text-white transition-all duration-300 border border-white/10 text-xs font-medium cursor-pointer group"
                    >
                      <Icon icon={cat.icon} className="w-3.5 h-3.5 text-[#DE8D3D] group-hover:text-white" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => handleScrollDown("adventure-explorer")}
          className="flex flex-col items-center gap-2 cursor-pointer text-white/50 hover:text-white transition-colors duration-300"
          aria-label="Scroll to explore"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold font-inter">
            SCROLL TO EXPLORE
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </button>
      </div>
    </section>
  );
}
