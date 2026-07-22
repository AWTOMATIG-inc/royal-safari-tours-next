"use client";

import { Icon } from "@iconify/react";

const features = [
  {
    icon: "lucide:zap",
    title: "Fast Response",
    description: "We reply within a few hours",
  },
  {
    icon: "lucide:users",
    title: "Local Experts",
    description: "Our team knows the best places and experiences",
  },
  {
    icon: "lucide:book-open",
    title: "Custom Itineraries",
    description: "100% personalized trips just for you",
  },
  {
    icon: "lucide:star",
    title: "Trusted by Travelers",
    description: "Rated 4.9/5 by 1800+ happy travelers",
  },
];

export default function ContactWhyChooseUs() {
  return (
    <section className="border-t border-b border-primary/8 py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="max-w-5xl mx-auto bg-primary text-white px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-[14px] sm:rounded-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 font-subheading">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-white/90">
                  <Icon icon={feature.icon} width="24" height="24" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[13px] sm:text-[15px] text-white mb-0.5 sm:mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] sm:text-[13px] text-gray-400 font-body leading-relaxed">
                    {feature.description}
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
