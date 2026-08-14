"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import { RevealGroup } from "@/components/animations";

export default function ContactQuickCards() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full container font-body">
      <div className="bg-sand/95 backdrop-blur-md rounded-3xl shadow-xl border border-primary/10 p-5 sm:p-8 md:p-10 font-body">
        <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6 lg:divide-x divide-gray-200/80 font-body">

          {/* WhatsApp */}
          <RevealGroup.Item className="flex flex-col items-center text-center p-2 sm:p-4 lg:p-2 font-body">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2 sm:mb-4 shrink-0">
              <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 sm:w-6 sm:h-6 text-whatsapp" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-primary font-heading mb-0.5 sm:mb-1">WhatsApp</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-body mb-2 sm:mb-4 hidden sm:block">Quick reply on WhatsApp</p>
            <a
              href={siteConfig.contact.phone.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer font-body"
            >
              <span>Chat Now</span>
              <Icon icon="lucide:arrow-right" className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </RevealGroup.Item>

          {/* Email */}
          <RevealGroup.Item className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6 font-body">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-2 sm:mb-4 shrink-0">
              <Icon icon="lucide:mail" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-primary font-heading mb-0.5 sm:mb-1">Email</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-body mb-2 sm:mb-4 hidden sm:block">We reply within a few hours</p>
            <a
              href={`mailto:${siteConfig.contact.email.support}`}
              className="text-[11px] sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer font-body"
            >
              <span>Send Email</span>
              <Icon icon="lucide:arrow-right" className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </RevealGroup.Item>

          {/* Call Us */}
          <RevealGroup.Item className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6 font-body">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-2 sm:mb-4 shrink-0">
              <Icon icon="lucide:phone" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-primary font-heading mb-0.5 sm:mb-1">Call Us</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-body mb-2 sm:mb-4 hidden sm:block">{siteConfig.contact.hours.weekday}</p>
            <a
              href={`tel:${siteConfig.contact.phone.supportRaw}`}
              className="text-[11px] sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer font-body"
            >
              <span>Call Now</span>
              <Icon icon="lucide:arrow-right" className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </RevealGroup.Item>

          {/* Our Office */}
          <RevealGroup.Item className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6 font-body">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/10 text-primary flex items-center justify-center mb-2 sm:mb-4 shrink-0">
              <Icon icon="lucide:map-pin" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-primary font-heading mb-0.5 sm:mb-1">Our Office</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-body mb-2 sm:mb-4 hidden sm:block">{siteConfig.contact.address.city}, {siteConfig.contact.address.country}</p>
            <a
              href="#map-section"
              className="text-[11px] sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer font-body"
            >
              <span>View on Map</span>
              <Icon icon="lucide:arrow-right" className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </RevealGroup.Item>

        </RevealGroup>
      </div>
    </div>
  );
}

