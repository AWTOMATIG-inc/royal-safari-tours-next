"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Reveal } from "@/components/animations";

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="section-md text-primary bg-sand overflow-hidden font-body">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Heading, Story, Mission */}
          <Reveal variant="fadeRight" className="lg:col-span-6 space-y-6 md:space-y-8">
            <SectionHeading
              subtitle="Our Narrative"
              title={
                <>
                  Redefining the Art <br />
                  <span className="italic font-normal font-heading text-accent">of Wilderness Travel</span>
                </>
              }
            />

            <div className="space-y-5 md:space-y-6 text-body-md leading-relaxed text-primary/80 font-light font-body">
              <p>
                Founded by a collective of passionate explorers, Royal Safari Tours emerged from a simple realization: travel should be profound, respectful, and intimately personal. We saw an opportunity to bridge the gap between rugged adventure and luxury hospitality.
              </p>
              <p>
                Whether tracking Bengal tigers in the deep mangrove forests of the Sundarbans, tasting organic tea in Sreemangal’s mist-veiled hills, or designing a bespoke corporate retreat, our journeys are custom-crafted to leave an enduring print on your memory.
              </p>
            </div>

            {/* Mission Statement Block */}
            <div className="relative pl-6 border-l-2 border-secondary py-2 space-y-1.5 font-body">
              <span className="text-xs font-semibold tracking-wider text-secondary uppercase block">
                Our Mission
              </span>
              <p className="font-heading text-lg md:text-xl italic font-medium text-primary/90">
                &ldquo;To deliver highly customized, sustainable, and unforgettable journeys that preserve the environment, empower local communities, and inspire human connection.&rdquo;
              </p>
            </div>
          </Reveal>

          {/* Right Column: Large Image + Floating Glass Quote */}
          <Reveal variant="fadeLeft" className="lg:col-span-6 mt-8 lg:mt-0">
            <div className="relative pb-10 pr-10 sm:pb-12 sm:pr-12 lg:pb-16 lg:pr-16">
              
              {/* Main Image */}
              <div className="relative aspect-[10/9] w-full overflow-hidden rounded-3xl shadow-lg border border-gray-200/80">
                <Image
                  src="/images/banners/about_hero.webp"
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
                <div className="bg-white/85 p-4 sm:p-6 rounded-2xl border border-gray-200/80 flex gap-3 sm:gap-4 items-start">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
                    <Icon icon="lucide:quote" className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 font-body">
                    <p className="text-primary/90 text-xs sm:text-sm italic font-medium leading-relaxed font-heading">
                      &ldquo;We do not inherit the earth from our ancestors, we borrow it from our children.&rdquo;
                    </p>
                    <span className="text-caption text-primary/60 uppercase font-semibold block pt-1">
                      — Native Proverb
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

