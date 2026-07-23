"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

const partners = [
  { name: "Grand Sultan Sylhet", logo: "/images/sponsors/Grand-Sultan-Sylhet.png" },
  { name: "Fly Far International", logo: "/images/sponsors/Fly-far-international.png" },
  { name: "Himalayan Club Tours", logo: "/images/sponsors/Himalayan-Club-tours.png" },
  { name: "Kaani Group Maldives", logo: "/images/sponsors/Kaani-Group.png" },
  { name: "Ramada by Wyndham", logo: "/images/sponsors/Ramada-Wyndham.png" },
  { name: "Travel Champ", logo: "/images/sponsors/Travel-Champ.png" },
];

export default function TrustedPartners() {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicated list for continuous infinite loop
  const partnerList = [...partners, ...partners, ...partners, ...partners];

  useEffect(() => {
    if (isPaused || isDragging) return;

    let animationFrameId;
    const container = sliderRef.current;

    const autoScroll = () => {
      if (container) {
        container.scrollLeft += 0.8;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDragging]);

  // Mouse Drag Handlers
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

  const handleScrollManual = (direction) => {
    setIsPaused(true);
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="section-sm text-primary border-t border-gray-100 overflow-hidden bg-sand font-body">
      <div className="container">
        
        <div className="flex items-center justify-between mb-6 font-body">
          <p className="text-xs font-accent tracking-[0.25em] uppercase font-bold text-accent">
            Credibility &amp; Global Alliances
          </p>

          {/* Manual Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScrollManual("left")}
              className="w-8 h-8 rounded-full bg-white hover:bg-primary text-primary hover:text-white border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll Left"
            >
              <Icon icon="lucide:chevron-left" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollManual("right")}
              className="w-8 h-8 rounded-full bg-white hover:bg-primary text-primary hover:text-white border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll Right"
            >
              <Icon icon="lucide:chevron-right" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Draggable Slider Track */}
        <div className="relative w-full overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-sand to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-sand to-transparent z-10 pointer-events-none" />

          <div
            ref={sliderRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex items-center gap-4 sm:gap-6 py-2 overflow-x-auto scrollbar-none select-none cursor-grab active:cursor-grabbing"
          >
            {partnerList.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-20 sm:h-24 w-40 sm:w-48 rounded-2xl bg-white hover:bg-white border border-gray-200/80 hover:border-secondary/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ease-out group/item px-6 cursor-pointer"
              >
                <div className="relative w-full h-14 flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={200}
                    height={80}
                    draggable={false}
                    className="max-h-12 w-auto object-contain filter grayscale opacity-75 group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-500 ease-in-out pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


