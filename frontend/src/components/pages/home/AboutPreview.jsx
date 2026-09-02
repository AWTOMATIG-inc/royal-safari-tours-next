"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations";

export default function AboutPreview() {
  return (
    <section className="section-md bg-sand text-primary overflow-hidden font-body">
      <div className="container">
        
        {/* Dark Luxury Forest Feature Card */}
        <div className="relative rounded-3xl bg-primary text-white overflow-hidden p-8 sm:p-12 md:p-16 lg:p-20 shadow-xl">
          
          {/* Ambient Background Gradient Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            
            {/* Left Column: Narrative & Values */}
            <Reveal variant="fadeRight" className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              <SectionHeading
                subtitle="OUR PHILOSOPHY"
                title={
                  <>
                    Crafting Profound <br />
                    <span className="italic font-normal font-heading text-white/90">Connections with Nature</span>
                  </>
                }
                dark
              />

              <div className="space-y-4 sm:space-y-5 text-body-md leading-relaxed text-white/80 font-light font-body">
                <p>
                  Royal Safari Tours was born from a passion for Bangladesh&rsquo;s wild spaces and rich heritage. We believe true luxury is not defined by excess, but by intimacy, authentic local stewardship, and seamless comfort.
                </p>
                <p>
                  From private river explorations in the Sundarbans to tea estate retreats in Sreemangal, our journeys are custom-designed to leave a lasting mark on your spirit.
                </p>
              </div>

              {/* Luxury Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10 font-body">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary shrink-0">
                    <Icon icon="lucide:check" className="w-4 h-4" />
                  </div>
                  <span className="text-label text-white/90">
                    100% Private Expeditions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary shrink-0">
                    <Icon icon="lucide:check" className="w-4 h-4" />
                  </div>
                  <span className="text-label text-white/90">
                    Native Wildlife Masters
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2.5 bg-secondary hover:bg-accent text-white font-semibold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5 font-body"
                >
                  <span>Discover Our Story</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </Link>
              </div>

            </Reveal>

            {/* Right Column: Arched Image Window */}
            <Reveal variant="fadeLeft" className="lg:col-span-5 relative w-full">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
                <Image
                  src="/images/banners/about_preview.webp"
                  alt="Royal Safari Tours Wilderness Journey"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </div>

              {/* Top-Right Floating Glass Badge */}
              <div className="absolute -top-4 -right-2 sm:top-6 sm:-right-6 p-[1px] bg-gradient-to-tr from-white/20 to-white/40 backdrop-blur-xl rounded-2xl shadow-xl max-w-[200px]">
                <div className="bg-primary/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1 text-center font-body">
                  <p className="font-heading text-xl font-bold text-accent">
                    10+ Years
                  </p>
                  <p className="text-[10px] tracking-widest text-white/75 uppercase font-semibold">
                    Crafting Private Expeditions
                  </p>
                </div>
              </div>
            </Reveal>

          </div>

        </div>

      </div>
    </section>
  );
}

