"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Hero() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById("who-we-are");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-44 sm:pt-36 sm:pb-52 md:pt-40 md:pb-60 lg:pt-48 lg:pb-44 overflow-hidden bg-[url('/images/banners/contact_hero.jpg')] bg-fixed bg-cover bg-center">
      {/* Gradient overlay - stronger on mobile for readability, identical to Contact Hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/70 to-light/30 sm:via-light/60 sm:to-transparent z-0" />

      {/* 2. Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8">
          {/* Left Column: Headline and Paragraph (Exact match to Contact page sizes/spacing) */}
          <div className="flex flex-col items-start text-left max-w-xl font-subheading">
            <SectionHeading
              subtitle="ABOUT US"
              title={
                <>
                  Creating Journeys
                  <br />
                  That Stay Forever
                </>
              }
              description="We are passionate about Bangladesh and the world. Royal Safari Tours brings you closer to extraordinary places and unforgettable experiences, crafted with care and local expertise."
              level="h1"
              className="mb-8 sm:mb-10"
              descriptionClassName="text-[15px] text-justify sm:text-[17px] md:text-[18px] text-primary/70 max-w-xl font-normal leading-relaxed font-body"
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto font-subheading">
              <Link
                href="/adventure"
                className="flex items-center justify-center gap-2.5 bg-primary hover:bg-secondary text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] shadow-sm hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide"
              >
                <span>Explore Tours</span>
                <Icon icon="lucide:arrow-right" width="16" height="16" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 border border-primary/20 hover:bg-primary/5 text-primary font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide bg-white/60 backdrop-blur-sm"
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
          className="flex flex-col items-center gap-1.5 cursor-pointer text-primary/50 hover:text-primary transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold font-subheading">
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
