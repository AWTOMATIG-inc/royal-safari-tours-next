"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

const stories = [
  {
    id: 1,
    name: "John Hendry",
    country: "United Kingdom",
    avatar: "/images/customers/john.webp",
    rating: 5,
    reviewText:
      "Tracking Bengal tigers in the Sundarbans was a lifelong dream. Royal Safari Tours delivered unmatched safety, native expertise, and five-star hospitality in the heart of the mangroves.",
  },
  {
    id: 2,
    name: "Sharolyn Myers",
    country: "Australia",
    avatar: "/images/customers/sharolyn.webp",
    rating: 5,
    reviewText:
      "Sreemangal's tea estate walk was unforgettable. The attention to detail, organic culinary pairings, and private lodges exceeded every expectation.",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    country: "Canada",
    avatar: "/images/customers/john.webp",
    rating: 5,
    reviewText:
      "A flawless international escape managed by Royal Safari. Extremely reliable 24/7 support, clear pricing, and private luxury retreats.",
  },
  {
    id: 4,
    name: "David Atwood",
    country: "United States",
    avatar: "/images/customers/sharolyn.webp",
    rating: 5,
    reviewText:
      "Our corporate wilderness retreat in Sajek Valley was executed with total perfection. Highly recommended for any executive travel.",
  },
];

export default function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[activeIndex];

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E] border-t border-gray-100">
      <div className="container px-4 sm:px-6">
        
        {/* Centered Magazine Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            Customer Stories
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
            Voices of the <br />
            <span className="italic font-normal">Discerning Traveler</span>
          </h2>
        </div>

        {/* Centered Spotlight Quote Card with Warm Ivory Fill */}
        <div className="relative max-w-3xl mx-auto">
          
          <div className="rounded-3xl sm:rounded-[2.5rem] bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_20px_60px_rgba(13,35,30,0.07)] p-6 sm:p-10 md:p-14 text-center space-y-6 sm:space-y-8 relative">
            
            {/* Quote Mark Icon Accent */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DE8D3D]/10 text-[#DE8D3D] flex items-center justify-center mx-auto">
              <Icon icon="lucide:quote" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 text-[#DE8D3D]">
              {Array.from({ length: currentStory.rating }).map((_, i) => (
                <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-[#DE8D3D]" />
              ))}
            </div>

            {/* Quote Text */}
            <p className="font-playfair text-lg sm:text-2xl md:text-3xl italic font-light leading-relaxed text-[#0D231E]/95">
              &ldquo;{currentStory.reviewText}&rdquo;
            </p>

            {/* User Details */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-[#e8e4d8]">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#DE8D3D] shrink-0 shadow-sm">
                <Image
                  src={currentStory.avatar}
                  alt={currentStory.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm sm:text-base text-[#0D231E] tracking-wide font-inter">
                  {currentStory.name}
                </h4>
                <p className="text-[#0D231E]/60 text-[11px] sm:text-xs font-light tracking-wider uppercase font-inter mt-0.5">
                  {currentStory.country}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex sm:hidden justify-center items-center gap-4 pt-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-[#dcd6c5] bg-white active:bg-[#0D231E] active:text-white flex items-center justify-center shadow-sm cursor-pointer"
                aria-label="Previous story"
              >
                <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-[#dcd6c5] bg-white active:bg-[#0D231E] active:text-white flex items-center justify-center shadow-sm cursor-pointer"
                aria-label="Next story"
              >
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Desktop/Tablet Side Arrow Controls */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-6 w-12 h-12 rounded-full border border-[#dcd6c5] bg-white hover:bg-[#0D231E] hover:text-white items-center justify-center shadow-lg transition-all duration-300 cursor-pointer z-10 text-[#0D231E]"
            aria-label="Previous story"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-6 w-12 h-12 rounded-full border border-[#dcd6c5] bg-white hover:bg-[#0D231E] hover:text-white items-center justify-center shadow-lg transition-all duration-300 cursor-pointer z-10 text-[#0D231E]"
            aria-label="Next story"
          >
            <Icon icon="lucide:arrow-right" className="w-5 h-5" />
          </button>

        </div>

        {/* Minimal Indicators */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? "w-8 bg-[#DE8D3D]" : "w-2 bg-[#0D231E]/20 hover:bg-[#0D231E]/40"
              }`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
