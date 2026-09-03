"use client";

import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";

export default function ContactHero() {
  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] pt-32 sm:pt-36 md:pt-40 pb-36 sm:pb-44 md:pb-48 bg-[url('/images/banners/contact_hero.webp')] bg-fixed bg-cover bg-left font-body">
      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-light/95 via-light/75 to-light/30 sm:via-light/65 sm:to-transparent z-0" />

      {/* Overlaid text content */}
      <div className="relative z-10 container">
        <div className="flex flex-col items-start text-left max-w-xl font-body">
          <SectionHeading
            subtitle="GET IN TOUCH"
            title={
              <>
                Let&rsquo;s Plan Your <br />
                <span className="italic font-normal text-accent font-heading">Next Adventure</span>
              </>
            }
            description={
              <>
                Have questions or need help planning your trip?<br className="hidden sm:block" /> Our team is here to create the perfect experience for you.
              </>
            }
            level="h1"
            className="mb-8 sm:mb-10"
            descriptionClassName="text-body-lg text-primary/75 max-w-xl leading-relaxed"
          />
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto font-body">
            <Button
              href={siteConfig.contact.phone.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              icon={<Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5" />}
            >
              Chat on WhatsApp
            </Button>
            <Button
              href={`tel:${siteConfig.contact.phone.supportRaw}`}
              variant="outline"
              icon={<Icon icon="lucide:phone" className="w-4 h-4 text-primary" />}
            >
              {siteConfig.contact.phone.support}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


