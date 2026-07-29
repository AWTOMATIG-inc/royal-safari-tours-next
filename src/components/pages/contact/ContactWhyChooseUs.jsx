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
    description: "Our team knows the best experiences",
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
    <section className="border-t border-b border-gray-200/80 py-8 sm:py-10 md:py-12 bg-white font-body">
      <div className="container">
        <div className="max-w-5xl mx-auto bg-primary text-white px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-3xl shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 font-body">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 font-body">
                <div className="text-secondary">
                  <Icon icon={feature.icon} className="w-6 h-6" />
                </div>
                <div className="flex flex-col font-body">
                  <h4 className="font-bold text-sm sm:text-base text-white mb-0.5 font-heading">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
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

