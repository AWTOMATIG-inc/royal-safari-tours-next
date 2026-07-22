"use client";

import { Icon } from "@iconify/react";

const services = [
  {
    icon: "lucide:map",
    title: "Domestic Tours",
    description: "Immersive private expeditions across Bangladesh, from the Sundarbans mangrove wilderness to the tea valleys of Sreemangal.",
  },
  {
    icon: "lucide:globe",
    title: "International Tours",
    description: "Bespoke global escapes to carefully selected destinations, managed with premium hospitality and local insights.",
  },
  {
    icon: "lucide:sliders",
    title: "Customized Trips",
    description: "Tailor-made itineraries crafted from scratch to align perfectly with your pace, style, and travel aspirations.",
  },
  {
    icon: "lucide:briefcase",
    title: "Corporate Travel",
    description: "Seamless logistics, VIP business travel, and meticulously designed team retreats that inspire collaboration.",
  },
];

export default function WhatWeOffer() {
  return (
    <section className="py-16 sm:py-24 md:py-3 text-primary border-t border-lightGray">
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 md:mb-20 space-y-3 md:space-y-4 font-subheading">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent block">
            Our Offerings
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Curated Expeditions, <br />
            <span className="italic font-normal text-primary/95">Tailored to Your Soul</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group bg-light border border-lightGray/80 hover:border-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_30px_rgba(13,35,30,0.02)] hover:shadow-[0_20px_50px_rgba(13,35,30,0.06)] hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              {/* Floating Top Arrow (Micro-interaction) */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <Icon icon="lucide:arrow-up-right" className="w-5 h-5" />
              </div>

              {/* Icon Container */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-secondary border border-lightGray transition-all duration-500 group-hover:bg-secondary group-hover:text-white group-hover:scale-110">
                <Icon icon={service.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-primary/70 font-light font-body">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
