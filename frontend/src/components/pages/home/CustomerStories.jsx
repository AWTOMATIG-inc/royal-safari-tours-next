"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/animations";

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
    <section className="section-md bg-white text-primary border-t border-gray-100 font-body">
      <div className="container">
        
        {/* Centered Magazine Header */}
        <SectionHeading
          subtitle="Customer Stories"
          title={
            <>
              Voices of the <br />
              <span className="italic font-normal font-heading text-accent">Discerning Traveler</span>
            </>
          }
          align="center"
          className="mb-10 sm:mb-14 md:mb-16"
        />

        {/* Centered Spotlight Quote Card */}
        <Reveal variant="scaleUp" className="relative max-w-6xl mx-auto">
          
          <div className="rounded-3xl sm:rounded-[2.5rem] bg-sand border border-primary/10 shadow-md p-6 sm:p-10 md:p-14 text-center space-y-6 sm:space-y-8 relative font-body">
            
            {/* Quote Mark Icon Accent */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
              <Icon icon="lucide:quote" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 text-accent">
              {Array.from({ length: currentStory.rating }).map((_, i) => (
                <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-accent" />
              ))}
            </div>

            {/* Quote Text */}
            <p className="font-heading text-lg sm:text-2xl md:text-3xl italic font-light leading-relaxed text-primary/95">
              &ldquo;{currentStory.reviewText}&rdquo;
            </p>

            {/* User Details */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-primary/10">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-accent shrink-0 shadow-xs">
                <Image
                  src={currentStory.avatar}
                  alt={currentStory.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="text-left font-body">
                <h4 className="font-bold text-sm sm:text-base text-primary tracking-wide font-heading">
                  {currentStory.name}
                </h4>
                <p className="text-primary/60 text-label mt-0.5">
                  {currentStory.country}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex sm:hidden justify-center items-center gap-4 pt-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-primary/15 bg-white active:bg-primary active:text-white flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Previous story"
              >
                <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-primary/15 bg-white active:bg-primary active:text-white flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Next story"
              >
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Desktop/Tablet Side Arrow Controls */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-6 w-12 h-12 rounded-full border border-primary/15 bg-white hover:bg-primary hover:text-white items-center justify-center shadow-md transition-all duration-300 cursor-pointer z-10 text-primary"
            aria-label="Previous story"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-6 w-12 h-12 rounded-full border border-primary/15 bg-white hover:bg-primary hover:text-white items-center justify-center shadow-md transition-all duration-300 cursor-pointer z-10 text-primary"
            aria-label="Next story"
          >
            <Icon icon="lucide:arrow-right" className="w-5 h-5" />
          </button>

          </Reveal>

        {/* Minimal Indicators */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12 font-body">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? "w-8 bg-accent" : "w-2 bg-primary/20 hover:bg-primary/40"
              }`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

