"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 md:py-32 text-white">
      <div className="container">
        
        {/* Background Banner with Rounded Corners */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-[url('/images/banners/banner2.webp')] bg-cover bg-center py-16 px-5 sm:py-24 sm:px-10 md:py-32 md:px-16 flex items-center justify-center">
          
          {/* Subtle nature-inspired dark overlay */}
          <div className="absolute inset-0 bg-[#0D231E]/60 backdrop-blur-[2px]" />

          {/* Floating Glass Card */}
          <div className="relative z-10 w-full max-w-2xl p-[1px] bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="rounded-[23px] bg-black/35 p-6 sm:p-10 md:p-12 text-center space-y-6 sm:space-y-8">
              
              <div className="space-y-3 sm:space-y-4">
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D]">
                  Uncharted Territories Await
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                  Begin Your Next <br />
                  <span className="italic font-normal text-white/90">Chapter of Adventure</span>
                </h2>
              </div>

              <p className="text-white/80 font-light text-base md:text-lg max-w-lg mx-auto font-inter leading-relaxed">
                Connect with our travel designers today to shape a bespoke itinerary tailored exclusively to your pace and curiosity.
              </p>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(44,183,117,0.3)] hover:shadow-[0_4px_20px_rgba(222,141,61,0.3)] hover:-translate-y-0.5"
                >
                  Start Planning
                  <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
