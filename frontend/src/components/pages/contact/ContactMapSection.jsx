"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";

export default function ContactMapSection() {
  return (
    <section id="map-section" className="container py-8 sm:py-10 md:py-14 font-body">
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-xs border border-gray-200/80">
        <iframe
          src={siteConfig.contact.address.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="Royal Safari Tours Location"
        />

        {/* Floating Map Info Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-6 md:right-10 sm:top-1/2 sm:-translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 md:p-7 sm:max-w-[280px] md:max-w-[320px] z-10 font-body text-left">
          <h3 className="text-base sm:text-lg font-bold text-primary font-heading mb-1 sm:mb-2">
            Find Us Easily
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3 sm:mb-4 font-body">
            We are located in the heart of Dhaka. Easy to reach and always happy to welcome you!
          </p>
          <a
            href={siteConfig.contact.address.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group/map cursor-pointer font-body"
          >
            <span>Open in Google Maps</span>
            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5 group-hover/map:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

