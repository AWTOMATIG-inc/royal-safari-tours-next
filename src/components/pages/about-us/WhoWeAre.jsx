"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="py-16 sm:py-24 md:py-32 text-[#0D231E] overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Heading, Story, Mission */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block">
                Our Narrative
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Redefining the Art <br />
                <span className="italic font-normal">of Wilderness Travel</span>
              </h2>
            </div>

            <div className="space-y-5 md:space-y-6 text-base md:text-lg leading-relaxed text-[#0D231E]/80 font-light text-justify">
              <p>
                Founded by a collective of passionate explorers, Royal Safari Tours emerged from a simple realization: travel should be profound, respectful, and intimately personal. We saw an opportunity to bridge the gap between rugged adventure and luxury hospitality.
              </p>
              <p>
                Whether tracking Bengal tigers in the deep mangrove forests of the Sundarbans, tasting organic tea in Sreemangal’s mist-veiled hills, or designing a bespoke corporate retreat, our journeys are custom-crafted to leave an enduring print on your memory.
              </p>
            </div>

            {/* Mission Statement Block */}
            <div className="relative pl-6 border-l-2 border-[#2cb775] py-2 space-y-1.5">
              <span className="text-xs font-semibold tracking-wider text-[#2cb775] uppercase block">
                Our Mission
              </span>
              <p className="font-playfair text-lg md:text-xl italic font-medium text-[#0D231E]/90">
                "To deliver highly customized, sustainable, and unforgettable journeys that preserve the environment, empower local communities, and inspire human connection."
              </p>
            </div>
          </div>

          {/* Right Column: Large Image + Floating Glass Quote */}
          <div className="lg:col-span-6 mt-8 lg:mt-0">
            <div className="relative pb-10 pr-10 sm:pb-12 sm:pr-12 lg:pb-16 lg:pr-16">
              
              {/* Decorative background shape */}
              <div className="absolute right-0 bottom-0 w-4/5 h-4/5 rounded-3xl  -z-10" />

              {/* Main Image */}
              <div className="relative aspect-[10/9] w-full overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="/images/banners/about.webp"
                  alt="Exploring the wilderness of Bangladesh"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                
                {/* Soft gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Glass Quote Card */}
              <div className="absolute bottom-4 left-4 right-10 sm:left-6 sm:bottom-6 md:left-8 md:bottom-8 md:-right-4 p-[1px] bg-gradient-to-tr from-white/20 to-white/40 backdrop-blur-md rounded-2xl shadow-xl transition-transform duration-500 hover:translate-y-[-4px]">
                <div className="bg-[#fcfaee]/80 p-4 sm:p-6 rounded-[15px] flex gap-3 sm:gap-4 items-start">
                  <div className="p-2 rounded-lg bg-[#DE8D3D]/10 text-[#DE8D3D] shrink-0">
                    <Icon icon="lucide:quote" className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0D231E]/90 text-xs sm:text-sm italic font-medium leading-relaxed">
                      "We do not inherit the earth from our ancestors, we borrow it from our children."
                    </p>
                    <span className="text-[9px] sm:text-[10px] tracking-widest text-[#0D231E]/60 uppercase font-semibold block pt-1">
                      — Native Proverb
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
