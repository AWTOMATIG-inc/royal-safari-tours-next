"use client";

import SectionHeading from "@/components/SectionHeading";
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
    <section className="section-md text-primary border-t border-gray-100 bg-white font-body">
      <div className="container">
        
        {/* Section Header */}
        <SectionHeading
          subtitle="Our Offerings"
          title={
            <>
              Curated Expeditions, <br />
              <span className="italic font-normal font-heading text-accent">Tailored to Your Soul</span>
            </>
          }
          className="mb-12 md:mb-16"
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 font-body">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group bg-sand border border-primary/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hover:shadow-lg hover:border-secondary/40 hover:-translate-y-1 transition-all duration-500 ease-out"
            >
              {/* Floating Top Arrow */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <Icon icon="lucide:arrow-up-right" className="w-5 h-5" />
              </div>

              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-secondary border border-gray-200 transition-all duration-500 group-hover:bg-secondary group-hover:text-white group-hover:scale-105 shadow-xs">
                <Icon icon={service.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-body-sm leading-relaxed text-primary/75 font-light">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

