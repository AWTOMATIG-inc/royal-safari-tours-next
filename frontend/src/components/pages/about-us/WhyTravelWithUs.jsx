"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import { Reveal, RevealGroup } from "@/components/animations";

const features = [
  {
    icon: "lucide:compass",
    title: "Local Experts",
    description: "Deep, generational knowledge of the destinations, offering unmatched insights and safety.",
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
    description: "Round-the-clock assistance from planning through to your return, so you can explore with peace.",
  },
];

export default function WhyTravelWithUs() {
  return (
    <section className="section-md text-primary border-t border-gray-100 bg-sand font-body">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Info */}
          <Reveal variant="fadeRight" className="lg:col-span-4">
            <SectionHeading
              subtitle="The Royal Standard"
              title={
                <>
                  Crafting Trust <br />
                  <span className="italic font-normal font-heading text-accent">in Every Journey</span>
                </>
              }
              description="We believe that luxury travel is defined by the details. By focusing on intimacy, safety, and authentic hospitality, we turn travel into transformation."
            />
          </Reveal>

          {/* Right Column: Clean Grid Features */}
          <RevealGroup className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-12 font-body">
            {features.map((feature, index) => (
              <RevealGroup.Item key={index} className="space-y-3 md:space-y-4 text-left group">
                {/* Icon */}
                <div className="text-secondary transition-transform duration-300 group-hover:translate-y-[-2px] inline-block">
                  <Icon icon={feature.icon} className="w-8 h-8 font-light" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-primary">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-body-sm leading-relaxed text-primary/75 font-light">
                  {feature.description}
                </p>
              </RevealGroup.Item>
            ))}
          </RevealGroup>

        </div>
      </div>
    </section>
  );
}

