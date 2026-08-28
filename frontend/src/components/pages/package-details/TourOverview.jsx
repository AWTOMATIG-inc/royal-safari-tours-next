"use client";

import SectionHeading from "@/components/SectionHeading";

export default function TourOverview({ tourPackage }) {
  if (!tourPackage?.description) return null;

  const sanitizedHtml = tourPackage.description
    .replace(/&nbsp;/g, " ")
    .replace(/<p><\/p>/g, "");

  return (
    <div className="space-y-4 font-body">
      <SectionHeading
        subtitle="EXPEDITION HIGHLIGHTS & OVERVIEW"
        title="About This Experience"
      />

      {/* Clean Editorial HTML Description Box */}
      <div className="bg-sand border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xs font-body">
        <div
          className="prose prose-emerald max-w-none text-body-md text-gray-700 font-light leading-relaxed space-y-4 font-body [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h3]:font-heading [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-primary [&>h3]:mt-6 [&>h3]:mb-3"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </div>
  );
}
