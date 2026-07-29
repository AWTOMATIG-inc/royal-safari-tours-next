"use client";

import SectionHeading from "@/components/SectionHeading";
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
    <section className="relative section-lg bg-about-banner bg-fixed bg-center bg-cover text-white overflow-hidden font-body">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-xs" />

      <div className="container relative z-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <SectionHeading
            subtitle="Testimonials"
            title={
              <>
                Voices of the <br />
                <span className="italic font-normal font-heading text-accent">Discerning Traveler</span>
              </>
            }
            dark
          />

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-accent hover:border-accent flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md cursor-pointer shadow-xs"
              aria-label="Previous testimonial page"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-accent hover:border-accent flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md cursor-pointer shadow-xs"
              aria-label="Next testimonial page"
            >
              <Icon icon="lucide:arrow-right" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch font-body">
          {visibleTestimonials.map((item) => (
            <div
              key={item.id}
              className="relative p-[1px] rounded-3xl bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-xl shadow-xl transition-transform duration-500 hover:scale-[1.01] max-w-2xl mx-auto lg:max-w-none w-full"
            >
              <div className="bg-primary/80 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-[23px] flex flex-col justify-between h-full space-y-6 text-left font-body">
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-accent" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="font-heading text-lg sm:text-xl md:text-2xl italic font-light leading-relaxed text-white/95">
                    &ldquo;{item.reviewText}&rdquo;
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-accent shrink-0 shadow-xs">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="font-body">
                    <h4 className="font-bold text-base sm:text-lg text-white font-heading">
                      {item.name}
                    </h4>
                    <p className="text-white/60 text-label mt-0.5">
                      {item.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Page Dots */}
        <div className="flex justify-center gap-2 mt-12 font-body">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? "w-8 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to testimonial slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
