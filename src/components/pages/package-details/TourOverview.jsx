"use client";

import { Icon } from "@iconify/react";

export default function TourOverview({ tourPackage }) {
  if (!tourPackage?.description) return null;

  const sanitizedHtml = tourPackage.description
    .replace(/&nbsp;/g, " ")
    .replace(/<p><\/p>/g, "");

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100 font-inter">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="max-w-4xl space-y-6">
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.25em] text-[#DE8D3D] uppercase block">
              EXPEDITION HIGHLIGHTS & OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-[#0D231E]">
              About This Experience
            </h2>
          </div>

          {/* Clean Editorial HTML Description Box */}
          <div className="bg-[#fcfbf7] border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div
              className="prose prose-emerald max-w-none text-sm sm:text-base text-gray-700 font-light leading-relaxed space-y-4 font-inter [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h3]:font-playfair [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#0D231E] [&>h3]:mt-6 [&>h3]:mb-3"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
