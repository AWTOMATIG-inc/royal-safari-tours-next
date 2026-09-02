"use client";

import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import { Reveal } from "@/components/animations";

export default function ClientGalleryHero() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById("gallery-grid-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] section-hero overflow-hidden bg-[url('/images/banners/memories_bg.webp')] bg-fixed bg-cover bg-center font-body flex items-center">
      {/* Light gradient overlay matching About Us hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/75 to-light/30 sm:via-light/65 sm:to-transparent z-0" />

      {/* Content Container */}
      <div className="relative z-10 container py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <SectionHeading
              subtitle="CLIENT STORIES & MOMENTS"
              title={
                <>
                  Royal Safari Client <br />
                  <span className="italic font-normal text-accent font-heading">Gallery</span>
                </>
              }
              description="Explore authentic moments, breathtaking landscapes, and unforgettable journeys shared by our valued travelers across South Asia and beyond."
              level="h1"
              className="mb-8 sm:mb-10"
              descriptionClassName="text-body-lg text-primary/75 max-w-xl leading-relaxed"
            />

            <Reveal variant="fadeUp" delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto font-body">
                <Button
                  href="/adventure"
                  variant="primary"
                  icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
                >
                  Explore Tours
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  icon={<Icon icon="lucide:phone" className="w-4 h-4" />}
                >
                  Contact Us
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer font-body">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 text-[11px] font-medium tracking-widest text-primary/60 hover:text-accent transition-colors group cursor-pointer"
          aria-label="Scroll down to gallery"
        >
          <span className="uppercase">Scroll to Explore</span>
          <Icon icon="lucide:chevron-down" className="w-4 h-4 animate-bounce text-accent" />
        </button>
      </div>
    </section>
  );
}
