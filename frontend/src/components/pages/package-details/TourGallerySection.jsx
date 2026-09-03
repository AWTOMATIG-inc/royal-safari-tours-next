"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function TourGallerySection({ tourPackage, onOpenGalleryAt }) {
  if (!tourPackage) return null;

  const images = [
    tourPackage.image?.startsWith("/")
      ? tourPackage.image
      : `/api/uploads/tour-packages/${tourPackage.image}`,
    "/images/banners/travel_inspiration.webp",
    "/images/banners/about_hero.webp",
    "/images/banners/contact_hero.webp",
  ].filter(Boolean);

  return (
    <section className="section-sm bg-sand border-b border-gray-200/80 font-body">
      <div className="container">
        <div className="max-w-4xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-body">
            <SectionHeading
              subtitle="VISUAL STORY"
              title="Expedition Gallery"
            />

            <button
              onClick={() => onOpenGalleryAt(0)}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-primary border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs font-body"
            >
              <Icon icon="lucide:camera" className="w-4 h-4 text-accent" />
              <span>View All ({images.length} Photos)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-body">
            {images.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => onOpenGalleryAt(idx)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-gray-200/60 bg-white"
              >
                <Image
                  src={imgSrc}
                  alt={`Tour Gallery ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Icon icon="lucide:maximize-2" className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

