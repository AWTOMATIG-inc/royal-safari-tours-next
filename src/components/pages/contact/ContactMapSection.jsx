"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";

export default function ContactMapSection() {
  return (
    <section id="map-section" className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-8 sm:py-10 md:py-14">
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] rounded-[14px] sm:rounded-[20px] overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9868735393165!2d90.37583641151624!3d23.74783307888796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33c892fb7%3A0x27747abef429a81a!2sDhanmondi%20Lake!5e0!3m2!1sen!2sbd!4v1716882112689!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="Google Map Location"
        />

        {/* Floating Map Info Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-6 md:right-10 sm:top-1/2 sm:-translate-y-1/2 bg-white rounded-[12px] sm:rounded-[16px] shadow-lg border border-gray-100 p-4 sm:p-6 md:p-7 sm:max-w-[280px] md:max-w-[320px] z-10 font-subheading text-left">
          <h3 className="text-base sm:text-lg font-bold text-primary font-heading mb-1 sm:mb-2">
            Find Us Easily
          </h3>
          <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-3 sm:mb-4 font-body">
            We are located in the heart of Dhaka. Easy to reach and always happy to welcome you!
          </p>
          <a
            href={siteConfig.contact.address.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] sm:text-[13px] font-semibold text-primary hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group/map cursor-pointer"
          >
            <span>Open in Google Maps</span>
            <Icon icon="lucide:arrow-right" width="14" height="14" className="group-hover/map:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
