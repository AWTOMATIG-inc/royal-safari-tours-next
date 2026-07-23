"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const defaultPackages = [
  {
    _id: "1",
    title: "Deep Sundarbans Tiger & Mangrove Safari",
    location: "Sundarbans",
    duration: "4 Days / 3 Nights",
    price: 25000,
    banner: "/images/banners/camping.webp",
    slug: "sundarbans-safari",
    shortDescription: "Navigate pristine riverways, track Bengal tigers, and experience evening wilderness silence.",
  },
  {
    _id: "2",
    title: "Sreemangal Tea Estates & Rainforest Trek",
    location: "Sreemangal",
    duration: "3 Days / 2 Nights",
    price: 18500,
    banner: "/images/banners/about.webp",
    slug: "sreemangal-tea-trek",
    shortDescription: "Bespoke tea tasting, organic forest walks, and stays in luxury boutique eco-lodges.",
  },
  {
    _id: "3",
    title: "Sajek Valley Cloud Peaks Retreat",
    location: "Sajek Valley",
    duration: "3 Days / 2 Nights",
    price: 21000,
    banner: "/images/banners/contact_hero.jpg",
    slug: "sajek-cloud-retreat",
    shortDescription: "Watch morning cloud seas roll over mountain ridge-lines in executive comfort.",
  },
  {
    _id: "4",
    title: "Cox's Bazar Private Coral & Beach Escape",
    location: "Cox's Bazar",
    duration: "5 Days / 4 Nights",
    price: 32000,
    banner: "/images/banners/banner1.webp",
    slug: "coxs-bazar-escape",
    shortDescription: "Experience private beachfront villas, island hopping, and sunset catamaran cruises.",
  },
  {
    _id: "5",
    title: "Sylhet Water Forest & Waterfall Expedition",
    location: "Sylhet",
    duration: "3 Days / 2 Nights",
    price: 19500,
    banner: "/images/banners/contact.webp",
    slug: "sylhet-water-forest",
    shortDescription: "Glide through Ratargul swamp forest and discover hidden hill stream waterfalls.",
  },
];

const getExperienceImageUrl = (item) => {
  const rawImage = item.image || item.banner;

  if (!rawImage) {
    return "/images/banners/camping.webp";
  }

  if (typeof rawImage === "string") {
    const trimmed = rawImage.trim();
    if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `/api/uploads/tour-packages/${trimmed}`;
  }

  return "/images/banners/camping.webp";
};

export default function FeaturedExperiences({ tourPackages = [] }) {
  const packagesList = tourPackages.length > 0 ? tourPackages : defaultPackages;

  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView());
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const totalPages = Math.max(1, packagesList.length - cardsPerView + 1);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused || isDragging || packagesList.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isDragging, packagesList.length]);

  const scrollToCard = (index) => {
    const validIndex = Math.max(0, Math.min(index, packagesList.length - 1));
    setCurrentIndex(validIndex);
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 340;
      const gap = 24;
      sliderRef.current.scrollTo({
        left: validIndex * (cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    setIsPaused(true);
    const nextIdx = currentIndex === 0 ? packagesList.length - 1 : currentIndex - 1;
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % packagesList.length;
    scrollToCard(nextIdx);
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 340;
      const gap = 24;
      const index = Math.round(sliderRef.current.scrollLeft / (cardWidth + gap));
      if (index >= 0 && index < packagesList.length) {
        setCurrentIndex(index);
      }
    }
  };

  return (
    <section className="section-md text-primary border-t border-gray-100 bg-white font-body overflow-hidden">
      <div className="container">
        
        {/* Section Header with Left / Right Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12 font-body">
          <SectionHeading
            subtitle="CURATED PACKAGES"
            title={
              <>
                Featured Experiences, <br />
                <span className="italic font-normal font-heading text-accent">Crafted for Discerning Minds</span>
              </>
            }
          />

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-sand hover:bg-primary text-primary hover:text-white border border-gray-200 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs"
              aria-label="Previous Package"
            >
              <Icon icon="lucide:chevron-left" className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-sand hover:bg-primary text-primary hover:text-white border border-gray-200 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs"
              aria-label="Next Package"
            >
              <Icon icon="lucide:chevron-right" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Responsive Touch/Drag Slider Track */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 select-none cursor-grab active:cursor-grabbing"
          >
            {packagesList.map((item, idx) => {
              const title = item.title || "Luxury Expedition";
              const location = item.location || "Bangladesh";
              const duration = item.duration || "Multi-Day Expedition";
              const imageSrc = getExperienceImageUrl(item);
              const slug = item.slug || item._id;

              return (
                <div
                  key={item._id || idx}
                  className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group/card relative rounded-3xl bg-sand border border-primary/10 shadow-xs hover:shadow-lg hover:border-secondary/40 overflow-hidden transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Package Banner Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        draggable={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 pointer-events-none"
                      />
                      
                      {/* Floating Location Tag */}
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wider uppercase flex items-center gap-1.5 border border-white/20 font-body">
                        <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                        <span>{location}</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 sm:p-7 space-y-4 font-body">
                      <div className="flex items-center justify-between text-caption text-accent uppercase">
                        <span className="flex items-center gap-1 font-body">
                          <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-secondary" />
                          {duration}
                        </span>
                        {item.price && (
                          <span className="text-primary bg-white px-3 py-1 rounded-full shadow-xs border border-primary/10 font-body font-bold text-xs">
                            From ৳{Number(item.price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight text-primary group-hover/card:text-secondary transition-colors duration-300">
                        {title}
                      </h3>

                      <p className="text-body-sm leading-relaxed text-primary/75 font-light line-clamp-3 font-body">
                        {item.shortDescription || item.description || "An exclusive private journey designed with heartfelt hospitality and expert local guidance."}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 font-body">
                    <Link
                      href={`/packages/${slug}`}
                      className="inline-flex items-center justify-between w-full py-3.5 px-5 rounded-xl bg-white border border-primary/15 group-hover/card:bg-primary group-hover/card:text-white group-hover/card:border-primary transition-all duration-300 text-xs font-semibold tracking-wider uppercase text-primary shadow-xs font-body"
                    >
                      <span>View Expedition Details</span>
                      <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots Indicator */}
        {packagesList.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {packagesList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsPaused(true);
                  scrollToCard(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-secondary shadow-xs"
                    : "w-2.5 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}


