"use client";

import { Icon } from "@iconify/react";

const pillars = [
  {
    icon: "lucide:compass",
    title: "Local Experts",
    description: "Generational regional knowledge and native expedition masters.",
  },
  {
    icon: "lucide:sparkles",
    title: "Curated Adventures",
    description: "Itineraries tailored from scratch to your exact curiosities.",
  },
  {
    icon: "lucide:coins",
    title: "Transparent Pricing",
    description: "Honest, all-inclusive luxury rates with zero hidden fees.",
  },
  {
    icon: "lucide:life-buoy",
    title: "24/7 Dedicated Support",
    description: "Round-the-clock concierge from pre-planning to return.",
  },
];

export default function WhyRoyalSafari() {
  return (
    <section className="py-12 md:py-16 text-primary border-t border-gray-100 bg-white">
      <div className="container">
        
        {/* Full-width Horizontal Ticker Strip Card */}
        <div className="rounded-3xl bg-lightGray border border-primary/10 p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-primary/15 gap-6 sm:gap-0">
            {pillars.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-6 first:pl-0 last:pr-0 group"
              >
                <div className="p-2.5 rounded-2xl bg-white border border-primary/15 text-accent shrink-0 transition-transform group-hover:scale-110 shadow-sm">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-base font-bold text-primary">
                    {item.title}
                  </h4>
                  <p className="text-xs text-primary/75 font-light font-inter leading-relaxed">
                    {item.description}
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
