"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "John Hendry",
    country: "United Kingdom",
    avatar: "/images/customers/john.webp",
    rating: 5,
    reviewText:
      "Tracking Bengal tigers in the Sundarbans was a lifelong dream, and Royal Safari Tours made it a luxurious reality. The guides were exceptionally knowledgeable, and the hospitality was warm and authentic.",
  },
  {
    id: 2,
    name: "Sharolyn Myers",
    country: "Australia",
    avatar: "/images/customers/sharolyn.webp",
    rating: 5,
    reviewText:
      "Sreemangal's tea estate tours are breathtaking, but what truly set the trip apart was the personalized attention. From organic dinners to secluded treks, everything was catered beautifully to our taste.",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    country: "Canada",
    avatar: "/images/customers/john.webp",
    rating: 5,
    reviewText:
      "A flawless international trip to Nepal organized by Royal Safari. Extremely reliable customer support, clear itineraries, and the perfect selection of boutique retreats. Highly recommended!",
  },
  {
    id: 4,
    name: "David Atwood",
    country: "United States",
    avatar: "/images/customers/sharolyn.webp",
    rating: 5,
    reviewText:
      "Their corporate retreat organization was seamless. They took care of every flight, private vehicle, and dietary requirement, while creating an adventure that brought our whole team closer.",
  },
];

export default function CustomerSays() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // Handle responsiveness for items per page and handle active index boundaries during resizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newItemsPerPage = width < 1024 ? 1 : 2;
      setItemsPerPage(newItemsPerPage);
      
      setActiveIndex((prevIndex) => {
        const newTotalPages = Math.ceil(testimonials.length / newItemsPerPage);
        if (prevIndex >= newTotalPages) {
          return Math.max(0, newTotalPages - 1);
        }
        return prevIndex;
      });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleTestimonials = testimonials.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section className="relative py-20 sm:py-28 md:py-36 bg-about-banner bg-center bg-cover text-white overflow-hidden">
      {/* Background overlay for styling */}
      <div className="absolute inset-0 bg-[#0D231E]/75 backdrop-blur-[2px]" />

      <div className="container relative z-10">
        {/* Header section with layout flex */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block">
              Testimonials
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight">
              Voices of the <br />
              <span className="italic font-normal">Discerning Traveler</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              aria-label="Previous testimonials"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              aria-label="Next testimonials"
            >
              <Icon icon="lucide:arrow-right" className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-500 ease-in-out">
          {visibleTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-[1px] rounded-3xl bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01] max-w-2xl mx-auto lg:max-w-none w-full"
            >
              {/* Inner Glass Box */}
              <div className="rounded-[23px] bg-black/20 p-6 sm:p-8 md:p-10 space-y-6">
                
                {/* Rating */}
                <div className="flex gap-1 text-[#DE8D3D]">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-[#DE8D3D]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-playfair text-lg md:text-xl italic font-light leading-relaxed text-white/95 min-h-[120px] sm:min-h-[100px]">
                  "{testimonial.reviewText}"
                </p>

                {/* User info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/25">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white tracking-wide">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/60 text-xs font-light tracking-wider mt-0.5 uppercase">
                      {testimonial.country}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bullet Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? "w-8 bg-[#DE8D3D]" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
