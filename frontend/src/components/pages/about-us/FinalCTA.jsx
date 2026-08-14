"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Reveal } from "@/components/animations";

export default function FinalCTA() {
  return (
    <section className="section-md text-white font-body bg-sand">
      <div className="container">
        
        {/* Background Banner with Rounded Corners */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-[url('/images/banners/banner2.webp')] bg-cover bg-center py-16 px-5 sm:py-24 sm:px-10 md:py-32 md:px-16 flex items-center justify-center">
          
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-primary/65 backdrop-blur-xs" />

          {/* Floating Glass Card */}
          <Reveal variant="scaleUp" className="relative z-10 w-full max-w-2xl p-[1px] bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="rounded-[23px] bg-black/40 p-6 sm:p-10 md:p-12 text-center space-y-6 sm:space-y-8 font-body">
              
              <SectionHeading
                subtitle="Uncharted Territories Await"
                title={
                  <>
                    Begin Your Next <br />
                    <span className="italic font-normal font-heading text-white/95">Chapter of Adventure</span>
                  </>
                }
                align="center"
                dark
              />

              <p className="text-white/85 font-light text-body-lg max-w-lg mx-auto leading-relaxed font-body">
                Connect with our travel designers today to shape a bespoke itinerary tailored exclusively to your pace and curiosity.
              </p>

              <div className="pt-2 font-body">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-2 bg-secondary hover:bg-accent text-white font-semibold text-xs tracking-wider uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5"
                >
                  <span>Start Planning</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}

