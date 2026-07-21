"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

export default function AdventureFinalCTA() {
  const handleScrollToCollection = () => {
    const collectionEl = document.getElementById("all-adventures");
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-white">
      <div className="container">
        
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-[url('/images/banners/banner2.webp')] bg-cover bg-center py-20 px-6 sm:py-28 sm:px-12 md:py-36 md:px-16 flex items-center justify-center min-h-[480px] sm:min-h-[550px]">
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#0D231E]/75 backdrop-blur-[2px]" />

          {/* Centered Glass CTA Card */}
          <div className="relative z-10 w-full max-w-2xl p-[1px] bg-gradient-to-tr from-white/10 to-white/35 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="rounded-[23px] bg-black/40 p-8 sm:p-12 text-center space-y-6 sm:space-y-8">
              
              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
                  Uncharted Wilderness Await
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                  Your Next Adventure <br />
                  <span className="italic font-normal text-white/90">Is Waiting.</span>
                </h2>
              </div>

              <p className="text-white/80 font-light text-sm sm:text-base max-w-lg mx-auto font-inter leading-relaxed">
                Connect with our senior travel designers today to shape a custom expedition tailored to your pace and curiosity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleScrollToCollection}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <span>Explore All Adventures</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <span>Plan Your Journey</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
