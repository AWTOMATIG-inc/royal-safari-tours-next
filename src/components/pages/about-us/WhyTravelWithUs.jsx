"use client";

import { Icon } from "@iconify/react";

const features = [
  {
    icon: "lucide:compass",
    title: "Local Experts",
    description: "Our guides possess deep, generational knowledge of the destinations, offering you unmatched insights and safety.",
  },
  {
    icon: "lucide:sparkles",
    title: "Personalized Experiences",
    description: "Every journey is tailored to your unique curiosities, ensuring a personal pace and unscripted memories.",
  },
  {
    icon: "lucide:coins",
    title: "Transparent Pricing",
    description: "Honest, all-inclusive rates with absolutely zero hidden fees. We build luxury on foundation of trust.",
  },
  {
    icon: "lucide:life-buoy",
    title: "Reliable Support",
    description: "Round-the-clock assistance from planning through to your return, so you can explore with peace of mind.",
  },
];

export default function WhyTravelWithUs() {
  return (
    <section className="py-16 sm:py-24 md:py-32 text-primary border-t border-lightGray">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Info */}
          <div className="lg:col-span-4 space-y-3 md:space-y-4 font-subheading">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent block">
              The Royal Standard
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-primary">
              Crafting Trust <br />
              <span className="italic font-normal">in Every Journey</span>
            </h2>
            <p className="text-sm text-primary/60 font-light leading-relaxed max-w-sm pt-1 font-body">
              We believe that luxury travel is defined by the details. By focusing on intimacy, safety, and authentic hospitality, we turn travel into transformation.
            </p>
          </div>

          {/* Right Column: Clean Grid Features */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-12">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3 md:space-y-4 text-left group">
                {/* Icon (small, outline, elegant) */}
                <div className="text-secondary transition-transform duration-300 group-hover:translate-y-[-2px] inline-block">
                  <Icon icon={feature.icon} className="w-8 h-8 font-light" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-primary/95">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-primary/70 font-light font-body">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
