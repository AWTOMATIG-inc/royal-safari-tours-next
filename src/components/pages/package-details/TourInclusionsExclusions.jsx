"use client";

import { Icon } from "@iconify/react";

export default function TourInclusionsExclusions({ tourPackage }) {
  // Extract or set realistic inclusions based on package data
  const inclusions = [
    "Dedicated Professional Tour Leader & Local Guide",
    "All Local Transportation & Sightseeing Transfers",
    "Pre-arranged Hotel / Resort Accommodations",
    "Complimentary Entry Tickets & Permit Clearances",
    "24/7 On-Call Customer Support & Safety Assistance",
  ];

  const exclusions = [
    "Personal Expenses & Personal Shopping",
    "Optional Water Sports & Unspecified Activities",
    "Gratuities / Tips for Drivers & Local Guides",
    "Travel & Health Insurance Coverage",
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#fcfbf7] border-b border-gray-200/80 font-inter">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="max-w-4xl space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.25em] text-[#DE8D3D] uppercase block">
              PACKAGE BREAKDOWN
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-[#0D231E]">
              What&apos;s Included & Excluded
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: What's Included */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:check-circle-2" className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#0D231E]">
                  What&apos;s Included
                </h3>
              </div>

              <ul className="space-y-3">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-light">
                    <Icon icon="lucide:check" className="w-4 h-4 text-[#2cb775] mt-0.5 flex-shrink-0 font-bold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What's Excluded */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:x-circle" className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#0D231E]">
                  What&apos;s Excluded
                </h3>
              </div>

              <ul className="space-y-3">
                {exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-500 font-light">
                    <Icon icon="lucide:x" className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
