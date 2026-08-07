"use client";

import { Icon } from "@iconify/react";
import { RevealGroup } from "@/components/animations";

const pillars = [
  {
    icon: "lucide:compass",
    title: "Local Experts",
    description: "Generational regional knowledge and native expedition.",
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
    <section className="section-sm text-primary border-t border-gray-100 bg-sand font-body">
      <div className="container">
        
        {/* Full-width Horizontal Ticker Strip Card */}
        <div className="rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-8 md:p-10 shadow-xs">
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 gap-6 sm:gap-0">
            {pillars.map((item, index) => (
              <RevealGroup.Item
                key={index}
                className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-6 first:pl-0 last:pr-0 group"
              >
                <div className="p-2.5 rounded-2xl bg-sand border border-primary/10 text-accent shrink-0 transition-transform group-hover:scale-110 shadow-xs">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-base font-bold text-primary">
                    {item.title}
                  </h4>
                  <p className="text-body-sm text-primary/75 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </RevealGroup.Item>
            ))}
          </RevealGroup>
        </div>

      </div>
    </section>
  );
}

