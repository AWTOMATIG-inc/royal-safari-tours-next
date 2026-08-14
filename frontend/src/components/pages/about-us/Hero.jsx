"use client";

import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import { Reveal } from "@/components/animations";

export default function Hero() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById("who-we-are");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] section-hero overflow-hidden bg-[url('/images/banners/contact_hero.jpg')] bg-fixed bg-cover bg-center font-body">
      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/75 to-light/30 sm:via-light/65 sm:to-transparent z-0" />

      {/* Content Container */}
      <div className="relative z-10 container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8">
          <div className="flex flex-col items-start text-left max-w-xl">
            <SectionHeading
              subtitle="ABOUT US"
              title={
                <>
                  Creating Journeys <br />
                  <span className="italic font-normal text-accent font-heading">That Stay Forever</span>
                </>
              }
              description="We are passionate about Bangladesh and the world. Royal Safari Tours brings you closer to extraordinary places and unforgettable experiences, crafted with care and local expertise."
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 cursor-pointer text-primary/50 hover:text-accent transition-colors duration-300"
          aria-label="Scroll down to content"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold font-accent">
            Scroll to explore
          </span>
          <Icon
            icon="lucide:chevron-down"
            width="16"
            height="16"
            className="animate-bounce"
          />
        </button>
      </div>
    </section>
  );
}


