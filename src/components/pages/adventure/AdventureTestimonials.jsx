"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    quote: "Tracking wild Bengal tigers in the Sundarbans was a bucket-list journey. Royal Safari Tours delivered unmatched safety, native expertise, and five-star private houseboat hospitality.",
    author: "John Hendry",
    country: "United Kingdom",
    experience: "Sundarbans Tiger Safari",
    rating: 5,
    image: "/images/banners/camping.webp",
  },
  {
    id: 2,
    quote: "The Sreemangal tea rainforest trek exceeded every expectation. Our native guide knew every bird call and secret waterfall path.",
    author: "Sharolyn Myers",
    country: "Australia",
    experience: "Sreemangal Rainforest Trek",
    rating: 5,
    image: "/images/banners/about.webp",
  },
  {
    id: 3,
    quote: "Our Sajek cloud peak retreat was pure magic. Watching morning clouds roll over mountain ridges from executive chalets is an memory I will cherish forever.",
    author: "Sarah Jenkins",
    country: "Canada",
    experience: "Sajek Cloud Peaks Retreat",
    rating: 5,
    image: "/images/banners/contact_hero.jpg",
  },
];

export default function AdventureTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E] border-t border-gray-100">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            Traveler Stories
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
            Voices of Exploration
          </h2>
        </div>

        {/* Large Editorial Testimonial Card */}
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-[#f8f6f0] border border-[#e8e4d8] shadow-[0_20px_60px_rgba(13,35,30,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Column: Quote & Details (7 Cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 space-y-6 flex flex-col justify-between h-full">
              
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#DE8D3D]">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-[#DE8D3D]" />
                  ))}
                </div>

                <p className="font-playfair text-xl sm:text-2xl md:text-3xl italic font-light leading-relaxed text-[#0D231E]">
                  &ldquo;{current.quote}&rdquo;
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-[#e8e4d8]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#0D231E] font-inter">
                      {current.author}
                    </h4>
                    <p className="text-xs text-[#0D231E]/60 uppercase font-semibold tracking-wider font-inter">
                      {current.country} • <span className="text-[#DE8D3D]">{current.experience}</span>
                    </p>
                  </div>

                  {/* Arrow Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full border border-[#dcd6c5] bg-white hover:bg-[#0D231E] hover:text-white flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer"
                      aria-label="Previous story"
                    >
                      <Icon icon="lucide:arrow-left" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full border border-[#dcd6c5] bg-white hover:bg-[#0D231E] hover:text-white flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer"
                      aria-label="Next story"
                    >
                      <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Travel Image (5 Cols) */}
            <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] w-full">
              <Image
                src={current.image}
                alt={current.experience}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
