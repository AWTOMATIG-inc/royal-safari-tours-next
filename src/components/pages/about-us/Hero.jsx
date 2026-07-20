"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById("who-we-are");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-44 sm:pt-36 sm:pb-52 md:pt-40 md:pb-60 lg:pt-48 lg:pb-44 overflow-hidden bg-[#fcfaee]">
      {/* 1. Full-width Background Image (Local asset - fixes hostname unconfigured error) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/contact_hero.jpg"
          alt="Misty Mountain River Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient overlay - stronger on mobile for readability, identical to Contact Hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcfaee]/95 via-[#fcfaee]/70 to-[#fcfaee]/30 sm:via-[#fcfaee]/60 sm:to-transparent" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8">
          {/* Left Column: Headline and Paragraph (Exact match to Contact page sizes/spacing) */}
          <div className="flex flex-col items-start text-left max-w-xl">
            <span className="text-[12px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase mb-4 sm:mb-5">
              ABOUT US
            </span>
            <h1 className="text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-normal leading-[1.08] text-[#0D231E] mb-5 sm:mb-7">
              Creating Journeys
              <br />
              That Stay Forever
            </h1>
            <p className="text-[15px] text-justify sm:text-[17px] md:text-[18px] text-[#0D231E]/70 font-inter leading-relaxed max-w-xl mb-8 sm:mb-10">
              We are passionate about Bangladesh and the world. Royal Safari
              Tours brings you closer to extraordinary places and unforgettable
              experiences, crafted with care and local expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/adventure"
                className="flex items-center justify-center gap-2.5 bg-[#0D231E] hover:bg-green text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] shadow-sm hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide"
              >
                <span>Explore Tours</span>
                <Icon icon="lucide:arrow-right" width="16" height="16" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 border border-[#0D231E]/20 hover:bg-[#0D231E]/5 text-[#0D231E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide bg-white/60 backdrop-blur-sm"
              >
                <span>Contact Us</span>
                <Icon icon="lucide:arrow-right" width="16" height="16" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Centered Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 cursor-pointer text-[#0D231E]/50 hover:text-[#0D231E] transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold font-inter">
            Scroll to explore
          </span>
          <Icon
            icon="lucide:chevron-down"
            width="16"
            height="16"
            className="animate-bounce"
          />
        </button>
      </div>
    </section>
  );
}
