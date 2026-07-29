"use client";

import SectionHeading from "@/components/SectionHeading";
import Rating from "@/components/Rating";
import { Icon } from "@iconify/react";

export default function TourReviews({ tourPackage }) {
  const reviews = [
    {
      name: "Tariqul Islam",
      date: "Verified Traveler",
      rating: 5,
      comment:
        "From the moment we departed to the final return, everything was arranged to perfection. The local safari guides were knowledgeable and attentive. Highly recommend booking with Royal Safari Tours!",
    },
    {
      name: "Sadia Rahman",
      date: "Verified Traveler",
      rating: 5,
      comment:
        "The resorts and food provided exceeded our expectations. Zero stress during the entire expedition. Can’t wait for our next journey!",
    },
    {
      name: "Mahmud Hasan",
      date: "Verified Traveler",
      rating: 4,
      comment:
        "Loved the experience and sight-seeing itineraries! Very smooth management and great support on WhatsApp.",
    },
  ];

  const numRating = Number(tourPackage?.rating) || 5;

  return (
    <section className="section-sm bg-white border-b border-gray-100 font-body">
      <div className="container">
        <div className="max-w-4xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 font-body">
            <SectionHeading
              subtitle="GUEST EXPERIENCES"
              title="Verified Traveler Reviews"
            />

            <div className="flex items-center gap-3 bg-sand border border-gray-200/80 px-4 py-2.5 rounded-2xl font-body">
              <div className="text-2xl font-bold font-heading text-primary">
                {numRating.toFixed(1)}
              </div>
              <div className="flex flex-col">
                <Rating rating={numRating} className="text-accent w-3.5 h-3.5" />
                <span className="text-[10px] text-gray-400 font-medium font-body">Based on traveler reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-sand border border-gray-200/80 rounded-2xl p-5 space-y-3 shadow-xs flex flex-col justify-between font-body"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-body">
                    <Rating rating={rev.rating} className="text-accent w-3.5 h-3.5" />
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-body font-light leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/60 flex items-center gap-2.5 font-body">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold font-heading">
                    {rev.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-primary font-body">
                    {rev.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

