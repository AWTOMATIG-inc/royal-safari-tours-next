"use client";

import { Icon } from "@iconify/react";

const steps = [
  {
    num: "01",
    title: "Local Expertise",
    desc: "Generational regional knowledge and native expedition guides.",
    icon: "lucide:compass",
  },
  {
    num: "02",
    title: "Curated Experiences",
    desc: "Bespoke itineraries tailored to your exact curiosities and pace.",
    icon: "lucide:sparkles",
  },
  {
    num: "03",
    title: "Trusted Guides",
    desc: "Wilderness safety masters trained in remote emergency care.",
    icon: "lucide:shield-check",
  },
  {
    num: "04",
    title: "Seamless Journey",
    desc: "End-to-end luxury concierge support from departure to return.",
    icon: "lucide:life-buoy",
  },
];

export default function WhyAdventureWithUs() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-[#0D231E] border-t border-gray-100">
      <div className="container">
        
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block font-inter">
            The Royal Standard
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0D231E]">
            Why Adventure With Us
          </h2>
          <p className="text-sm text-[#0D231E]/70 font-light font-inter max-w-md">
            Four guiding principles behind every private wilderness expedition we curate.
          </p>
        </div>

        {/* Horizontal Connected Timeline Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-[#e2ddd0] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="group flex flex-col space-y-5 bg-[#f8f6f0] lg:bg-transparent p-6 sm:p-7 lg:p-0 rounded-3xl lg:rounded-none border lg:border-none border-[#e8e4d8]"
              >
                {/* Step Circle & Number */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#d8d2c2] shadow-sm flex items-center justify-center text-[#DE8D3D] font-playfair font-bold text-xl group-hover:bg-[#0D231E] group-hover:text-white group-hover:border-[#0D231E] transition-all duration-300">
                    {step.num}
                  </div>
                  <div className="lg:hidden text-[#2cb775]">
                    <Icon icon={step.icon} className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-playfair text-xl font-bold text-[#0D231E] group-hover:text-[#2cb775] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#0D231E]/75 font-light font-inter">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
