"use client";

import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/animations";

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
    <section className="relative w-full min-h-screen flex items-center justify-center section-hero overflow-hidden bg-[url('/images/banners/banner1.webp')] bg-fixed bg-cover bg-center font-body">
      {/* Light gradient overlay for luxury contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/75 to-light/30 sm:via-light/65 sm:to-transparent z-0" />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headline Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left max-w-xl">
            <SectionHeading
              subtitle="ROYAL SAFARI TOURS"
              title={
                <>
                  Where Wilderness Meets <br />
                  <span className="italic font-normal text-accent font-heading">Unmatched Luxury!</span>
                </>
              }
              description="Experience hand-crafted, low-impact luxury expeditions through Bangladesh's pristine mangroves, tea valleys, and coastal sanctuaries."
              level="h1"
              className="mb-8 sm:mb-10"
              descriptionClassName="text-body-lg text-primary/75 max-w-xl leading-relaxed"
            />
            <Reveal variant="fadeUp" delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto font-body">
                <Button
                  href="/adventure"
                  variant="primary"
                  icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
                >
                  Explore Expeditions
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  icon={<Icon icon="lucide:phone" className="w-4 h-4" />}
                >
                  Plan Custom Trip
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Search Card Widget */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Reveal variant="fadeLeft" delay={0.2} className="w-full max-w-md">
              <div className="relative w-full rounded-3xl p-[1px] bg-gradient-to-tr from-accent/30 to-secondary/30 shadow-xl backdrop-blur-xl">
                <div className="bg-sand rounded-[23px] border border-primary/10 p-6 sm:p-8 space-y-6 shadow-md">

                  <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] font-bold text-accent uppercase font-accent">
                        Curated Search
                      </p>
                      <h3 className="font-heading text-xl font-bold text-primary mt-0.5">
                        Find Your Expedition
                      </h3>
                    </div>
                    <div className="p-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
                      <Icon icon="lucide:sliders" width="18" height="18" />
                    </div>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-4">
                    {/* Destination Field */}
                    <div className="space-y-1.5">
                      <label className="text-label text-primary/70 block">
                        Destination
                      </label>
                      <div className="relative">
                        <select
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary font-body focus:outline-none focus:border-secondary appearance-none cursor-pointer pr-10 shadow-xs"
                        >
                          <option value="">Select Destination...</option>
                          <option value="Sundarbans">Sundarbans Mangrove</option>
                          <option value="Sreemangal">Sreemangal Tea Valleys</option>
                          <option value="Cox's Bazar">Cox's Bazar Coast</option>
                          <option value="Sajek Valley">Sajek Cloud Valley</option>
                          <option value="Sylhet">Sylhet Water Forests</option>
                        </select>
                        <Icon icon="lucide:chevron-down" className="w-4 h-4 text-primary/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Expedition Type */}
                    <div className="space-y-1.5">
                      <label className="text-label text-primary/70 block">
                        Expedition Style
                      </label>
                      <div className="relative">
                        <select
                          value={expeditionType}
                          onChange={(e) => setExpeditionType(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary font-body focus:outline-none focus:border-secondary appearance-none cursor-pointer pr-10 shadow-xs"
                        >
                          <option value="">All Experiences...</option>
                          <option value="Wilderness Safari">Wilderness Safari</option>
                          <option value="Luxury Cultural Retreat">Luxury Cultural Retreat</option>
                          <option value="Private River Cruise">Private River Cruise</option>
                          <option value="Custom Itinerary">Custom Itinerary</option>
                        </select>
                        <Icon icon="lucide:chevron-down" className="w-4 h-4 text-primary/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Submit Search Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-xs uppercase tracking-wider cursor-pointer font-body"
                    >
                      <Icon icon="lucide:search" width="15" height="15" />
                      <span>Search Journeys</span>
                    </button>
                  </form>

                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Centered Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 cursor-pointer text-primary/50 hover:text-accent transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold font-accent">
            Scroll to explore
          </span>
          <Icon icon="lucide:chevron-down" width="16" height="16" className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}

