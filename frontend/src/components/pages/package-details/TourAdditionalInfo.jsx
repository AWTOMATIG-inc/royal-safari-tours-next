"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function TourAdditionalInfo({ tourPackage }) {
  const [openIndex, setOpenIndex] = useState(0);

  const sanitizedAdditional = tourPackage?.additionalInfo
    ? tourPackage.additionalInfo.replace(/&nbsp;/g, " ").replace(/<p><\/p>/g, "")
    : "";

  const items = [
    {
      title: "Essential Information & Policies",
      content: sanitizedAdditional || "Guests are requested to carry a valid government-issued National ID (NID) or Passport during travel for hotel check-ins and security permits. Group departures require punctual arrival at designated pickup spots.",
    },
    {
      title: "Pickup & Drop-off Details",
      content: "Pickup location and exact departure time will be confirmed via phone/WhatsApp 24 hours prior to travel. Private transfers can be customized upon request during booking.",
    },
    {
      title: "Cancellation & Refund Policy",
      content: "Cancellations made 7+ days prior to travel date receive a 80% refund. Cancellations within 72 hours of travel are non-refundable due to pre-booked hotel and permit arrangements.",
    },
    {
      title: "What to Pack & Prepare",
      content: "We recommend comfortable walking shoes, lightweight cotton apparel, personal toiletries, power banks, sun protection, and a refillable water bottle.",
    },
  ];

  return (
    <div className="space-y-8 font-subheading">
      <SectionHeading
        subtitle="GOOD TO KNOW"
        title="Additional Information"
      />

      <div className="space-y-3 font-subheading">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-sand border border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-primary cursor-pointer hover:bg-gray-100/50"
              >
                <span className="text-sm sm:text-base font-heading font-bold">
                  {item.title}
                </span>
                <Icon
                  icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                  className="w-5 h-5 text-accent flex-shrink-0"
                />
              </button>

              {isOpen && (
                <div className="p-5 sm:p-6 pt-3 border-t border-gray-200/50 text-xs sm:text-sm text-gray-700 font-light leading-relaxed prose prose-emerald max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2 font-body">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
