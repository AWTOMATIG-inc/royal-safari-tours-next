"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [expeditionType, setExpeditionType] = useState("");

  const handleScrollDown = () => {
    const nextSection = document.getElementById("featured-destinations");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/adventure?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-24 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banners/banner1.webp"
          alt="Wilderness Sanctuary of Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[10000ms] ease-out scale-105 hover:scale-100"
        />
        {/* White gradient overlay for clean text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 to-white/35 sm:via-white/70 sm:to-transparent" />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left max-w-xl">
            <span className="inline-flex items-center gap-2 text-[12px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase mb-4 sm:mb-5">
              <Icon icon="lucide:compass" className="w-4 h-4 animate-spin-slow" />
              ROYAL SAFARI TOURS
            </span>
            <h1 className="text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-normal leading-[1.08] text-[#0D231E] mb-5 sm:mb-7">
              Where Wilderness Meets <br />
              <span className="italic font-normal text-[#0D231E]/90">Unmatched Luxury</span>
            </h1>
            <p className="text-[15px] sm:text-[17px] md:text-[18px] text-[#0D231E]/75 font-inter leading-relaxed max-w-xl mb-8 sm:mb-10">
              Experience hand-crafted, low-impact luxury expeditions through Bangladesh&rsquo;s pristine mangroves, tea valleys, and coastal sanctuaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/adventure"
                className="flex items-center justify-center gap-2.5 bg-[#0D231E] hover:bg-[#2cb775] text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] shadow-sm hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide"
              >
                <span>Explore Expeditions</span>
                <Icon icon="lucide:arrow-right" width="16" height="16" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 border border-[#0D231E]/20 hover:bg-[#0D231E]/5 text-[#0D231E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide bg-white/80 backdrop-blur-sm"
              >
                <span>Plan Custom Trip</span>
                <Icon icon="lucide:arrow-right" width="16" height="16" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Search/Booking Widget with Luxury Card Fill */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-[28px] p-[1px] bg-gradient-to-tr from-[#DE8D3D]/30 to-[#2cb775]/30 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.01]">
              <div className="bg-[#f8f6f0] rounded-[27px] border border-[#0D231E]/10 p-6 sm:p-8 space-y-6 shadow-xl">
                
                <div className="flex items-center justify-between border-b border-[#0D231E]/10 pb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] font-bold text-[#DE8D3D] uppercase">
                      Curated Search
                    </p>
                    <h3 className="font-playfair text-xl font-bold text-[#0D231E] mt-0.5">
                      Find Your Expedition
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-full bg-[#2cb775]/10 border border-[#2cb775]/20 text-[#2cb775]">
                    <Icon icon="lucide:sliders" width="20" height="20" />
                  </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Destination Field */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider text-[#0D231E]/70 uppercase font-inter block">
                      Destination
                    </label>
                    <div className="relative">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D231E] font-inter focus:outline-none focus:border-[#2cb775] appearance-none cursor-pointer pr-10 shadow-sm"
                      >
                        <option value="">Select Destination...</option>
                        <option value="Sundarbans">Sundarbans Mangrove</option>
                        <option value="Sreemangal">Sreemangal Tea Valleys</option>
                        <option value="Cox's Bazar">Cox's Bazar Coast</option>
                        <option value="Sajek Valley">Sajek Cloud Valley</option>
                        <option value="Sylhet">Sylhet Water Forests</option>
                      </select>
                      <Icon icon="lucide:chevron-down" className="w-4 h-4 text-[#0D231E]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Expedition Type */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wider text-[#0D231E]/70 uppercase font-inter block">
                      Expedition Style
                    </label>
                    <div className="relative">
                      <select
                        value={expeditionType}
                        onChange={(e) => setExpeditionType(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D231E] font-inter focus:outline-none focus:border-[#2cb775] appearance-none cursor-pointer pr-10 shadow-sm"
                      >
                        <option value="">All Experiences...</option>
                        <option value="Wilderness Safari">Wilderness Safari</option>
                        <option value="Luxury Cultural Retreat">Luxury Cultural Retreat</option>
                        <option value="Private River Cruise">Private River Cruise</option>
                        <option value="Custom Itinerary">Custom Itinerary</option>
                      </select>
                      <Icon icon="lucide:chevron-down" className="w-4 h-4 text-[#0D231E]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Search Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm uppercase tracking-wider cursor-pointer"
                  >
                    <Icon icon="lucide:search" width="16" height="16" />
                    <span>Search Journeys</span>
                  </button>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Centered Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 cursor-pointer text-[#0D231E]/50 hover:text-[#0D231E] transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold font-inter">
            Scroll to explore
          </span>
          <Icon icon="lucide:chevron-down" width="16" height="16" className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
