"use client";

import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const getExperienceImageUrl = (item) => {
  const rawImage = item.image || item.banner;

  if (!rawImage) {
    return "/images/banners/camping.webp";
  }

  if (typeof rawImage === "string") {
    const trimmed = rawImage.trim();
    if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `/api/uploads/tour-packages/${trimmed}`;
  }

  return "/images/banners/camping.webp";
};

export default function FeaturedExperiences({ tourPackages = [] }) {
  const displayPackages = tourPackages.length > 0 ? tourPackages.slice(0, 3) : [
    {
      _id: "1",
      title: "Deep Sundarbans Tiger & Mangrove Safari",
      location: "Sundarbans",
      duration: "4 Days / 3 Nights",
      price: 25000,
      banner: "/images/banners/camping.webp",
      slug: "sundarbans-safari",
      shortDescription: "Navigate pristine riverways, track Bengal tigers, and experience evening wilderness silence.",
    },
    {
      _id: "2",
      title: "Sreemangal Tea Estates & Rainforest Trek",
      location: "Sreemangal",
      duration: "3 Days / 2 Nights",
      price: 18500,
      banner: "/images/banners/about.webp",
      slug: "sreemangal-tea-trek",
      shortDescription: "Bespoke tea tasting, organic forest walks, and stays in luxury boutique eco-lodges.",
    },
    {
      _id: "3",
      title: "Sajek Valley Cloud Peaks Retreat",
      location: "Sajek Valley",
      duration: "3 Days / 2 Nights",
      price: 21000,
      banner: "/images/banners/contact_hero.jpg",
      slug: "sajek-cloud-retreat",
      shortDescription: "Watch morning cloud seas roll over mountain ridge-lines in executive comfort.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 text-primary border-t border-gray-100 bg-white">
      <div className="container">
        
        {/* Section Header */}
        <SectionHeading
          subtitle="Curated Packages"
          title={
            <>
              Featured Experiences, <br />
              <span className="italic font-normal">Crafted for Discerning Minds</span>
            </>
          }
          className="mb-10 sm:mb-14 md:mb-16"
        />

        {/* Clean 3-Card Experience Grid with Warm Luxury Card Fills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayPackages.map((item) => {
            const title = item.title || "Luxury Expedition";
            const location = item.location || "Bangladesh";
            const duration = item.duration || "Multi-Day Expedition";
            const imageSrc = getExperienceImageUrl(item);
            const slug = item.slug || item._id;

            return (
              <div
                key={item._id}
                className="group relative rounded-3xl bg-sand border border-primary/10 shadow-[0_8px_30px_rgba(13,35,30,0.04)] hover:shadow-[0_20px_50px_rgba(13,35,30,0.12)] hover:border-secondary/40 overflow-hidden transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Package Banner Image */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] w-full overflow-hidden font-subheading">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Floating Location Tag */}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-primary/75 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 border border-white/20">
                      <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-accent" />
                      <span>{location}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 md:p-8 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-accent uppercase font-subheading">
                      <span className="flex items-center gap-1">
                        <Icon icon="lucide:clock" className="w-3.5 h-3.5" />
                        {duration}
                      </span>
                      {item.price && (
                        <span className="text-primary bg-white px-3 py-1 rounded-full shadow-sm border border-primary/10 font-mono font-bold">
                          From ৳{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-2xl font-bold leading-tight text-primary group-hover:text-secondary transition-colors duration-300">
                      {title}
                    </h3>

                    <p className="text-sm leading-relaxed text-primary/75 font-light font-body line-clamp-3">
                      {item.shortDescription || item.description || "An exclusive private journey designed with heartfelt hospitality and expert local guidance."}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 sm:px-7 sm:pb-7 md:px-8 md:pb-8 pt-0 font-subheading">
                  <Link
                    href={`/packages/${slug}`}
                    className="inline-flex items-center justify-between w-full py-3.5 px-5 rounded-xl bg-white border border-primary/15 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 text-xs font-semibold tracking-wider uppercase text-primary shadow-sm"
                  >
                    <span>View Expedition Details</span>
                    <Icon icon="lucide:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
