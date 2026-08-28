"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";

export default function TourInclusionsExclusions({ tourPackage }) {
  const defaultInclusions = [
    "Dedicated Professional Tour Leader & Local Guide",
    "All Local Transportation & Sightseeing Transfers",
    "Pre-arranged Hotel / Resort Accommodations",
    "Complimentary Entry Tickets & Permit Clearances",
    "24/7 On-Call Customer Support & Safety Assistance",
  ];

  const defaultExclusions = [
    "Personal Expenses & Personal Shopping",
    "Optional Water Sports & Unspecified Activities",
    "Gratuities / Tips for Drivers & Local Guides",
    "Travel & Health Insurance Coverage",
  ];

  const inclusions = tourPackage?.inclusions?.length
    ? tourPackage.inclusions
    : defaultInclusions;

  const exclusions = tourPackage?.exclusions?.length
    ? tourPackage.exclusions
    : defaultExclusions;

  return (
    <div className="space-y-8 font-body">
      <SectionHeading
        subtitle="PACKAGE BREAKDOWN"
        title="Inclusions & Exclusions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
        {/* Left: Inclusions */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 font-body">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Icon icon="lucide:check-circle-2" className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-lg font-bold text-primary">
              What's Included
            </h4>
          </div>

          <ul className="space-y-3 font-body">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-body-sm text-gray-700 font-light">
                <Icon icon="lucide:check" className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Exclusions */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 font-body">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Icon icon="lucide:x-circle" className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-lg font-bold text-primary">
              What's Not Included
            </h4>
          </div>

          <ul className="space-y-3 font-body">
            {exclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-body-sm text-gray-700 font-light">
                <Icon icon="lucide:x" className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
