"use client";

import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";

export default function ContactHero() {
  return (
    <section className="relative w-full pt-32 pb-64 sm:pt-36 sm:pb-72 md:pt-40 md:pb-80 lg:pt-48 lg:pb-44 mb-8 bg-[url('/images/banners/contact_hero.jpg')] bg-fixed bg-cover bg-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/70 to-light/30 sm:via-light/60 sm:to-transparent z-0" />

      {/* Overlaid text content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="flex flex-col items-start text-left max-w-xl font-subheading">
          <SectionHeading
            subtitle="GET IN TOUCH"
            title={
              <>
                Let&rsquo;s Plan Your<br />Next Adventure
              </>
            }
            description={
              <>
                Have questions or need help planning your trip?<br className="hidden sm:block" /> Our team is here to create the perfect experience for you.
              </>
            }
            level="h1"
            className="mb-8 sm:mb-10"
            descriptionClassName="text-[15px] sm:text-[17px] md:text-[18px] text-primary/70 max-w-xl font-normal leading-relaxed font-body"
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto font-subheading">
            <a
              href={siteConfig.contact.phone.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 bg-primary hover:bg-secondary text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] shadow-sm hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide"
            >
              <Icon icon="akar-icons:whatsapp-fill" width="20" height="20" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.supportRaw}`}
              className="flex items-center justify-center gap-2.5 border border-primary/20 hover:bg-primary/5 text-primary font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide bg-white/60 backdrop-blur-sm"
            >
              <Icon icon="lucide:phone" width="18" height="18" className="text-primary" />
              <span>{siteConfig.contact.phone.support}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
