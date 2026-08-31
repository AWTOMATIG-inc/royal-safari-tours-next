"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { RevealGroup } from "@/components/animations";

const defaultImages = {
  sundarbans: "/images/banners/camping.webp",
  sreemangal: "/images/banners/about.webp",
  "cox's bazar": "/images/banners/banner2.webp",
  sajek: "/images/banners/contact_hero.jpg",
  bangladesh: "/images/banners/camping.webp",
};

const getDestinationImageUrl = (item) => {
  const title = item.country || item.title || item.name || "";
  const rawImage = item.image || item.banner;

  if (!rawImage) {
    return defaultImages[title.toLowerCase()] || "/images/banners/camping.webp";
  }

  if (typeof rawImage === "string") {
    const trimmed = rawImage.trim();
    if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `/api/uploads/locations/${trimmed}`;
  }

  return defaultImages[title.toLowerCase()] || "/images/banners/camping.webp";
};

export default function FeaturedDestinations({ locations = [] }) {
  const displayLocations = locations.length > 0 ? locations.slice(0, 4) : [
    { _id: "1", country: "Sundarbans", title: "Sundarbans", description: "The world's largest mangrove forest, home of the Royal Bengal Tiger.", banner: "/images/banners/camping.webp", slug: "sundarbans" },
    { _id: "2", country: "Sreemangal", title: "Sreemangal", description: "Rolling green tea valleys, organic gardens, and rainforest trails.", banner: "/images/banners/about.webp", slug: "sreemangal" },
    { _id: "3", country: "Cox's Bazar", title: "Cox's Bazar", description: "The longest unbroken natural sea beach in the world.", banner: "/images/banners/banner2.webp", slug: "coxs-bazar" },
    { _id: "4", country: "Sajek Valley", title: "Sajek Valley", description: "Mist-covered mountain peaks in the Chittagong Hill Tracts.", banner: "/images/banners/contact_hero.jpg", slug: "sajek-valley" },
  ];

  return (
    <section id="featured-destinations" className="section-md text-primary font-body bg-sand">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 md:mb-16 gap-4 sm:gap-6">
          <SectionHeading
            subtitle="Sacred Sanctuaries"
            title={
              <>
                Featured Destinations, <br />
                <span className="italic font-normal font-heading text-accent">Unspoiled &amp; Raw</span>
              </>
            }
          />

          <Link
            href="/adventure"
            className="inline-flex items-center gap-2 text-label text-primary hover:text-accent transition-colors duration-300 group shrink-0"
          >
            <span>View All Destinations</span>
            <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Clean Balanced Grid */}
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayLocations.map((item) => {
            const title = item.country || item.title || item.name || "Destination";
            const imageSrc = getDestinationImageUrl(item);

            return (
              <RevealGroup.Item key={item._id}>
                <Link
                  href={`/adventure?destination=${encodeURIComponent(title)}`}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-black/5 shadow-sm hover:shadow-xl transition-transform transition-colors duration-300 hover:-translate-y-1 transform-gpu flex flex-col justify-end p-6 sm:p-7 md:p-8 border border-gray-200/80 w-full h-full block"
                >
                  {/* Image */}
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Glass Tag & Info */}
                  <div className="relative z-10 space-y-2 text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 font-accent rounded-full bg-black/60 text-white text-[10px] font-semibold tracking-[0.2em] uppercase border border-white/20">
                        Expedition Region
                      </span>
                      <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                        <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
                      {title}
                    </h3>

                    {item.description && (
                      <p className="text-body-sm font-light text-white/80 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              </RevealGroup.Item>
            );
          })}
        </RevealGroup>

      </div>
    </section>
  );
}

