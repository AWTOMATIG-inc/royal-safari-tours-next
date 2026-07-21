"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";

export default function ContactQuickCards() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-8">
      <div className="bg-white/95 backdrop-blur-md rounded-[16px] sm:rounded-[20px] shadow-xl border border-[#0D231E]/5 p-5 sm:p-8 md:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6 lg:divide-x divide-gray-100">

          {/* WhatsApp */}
          <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:p-2">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#e8f7f0] text-green-600 flex items-center justify-center mb-2 sm:mb-4">
              <Icon icon="akar-icons:whatsapp-fill" width="22" height="22" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">WhatsApp</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">Quick reply on WhatsApp</p>
            <a
              href={siteConfig.contact.phone.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
            >
              <span>Chat Now</span>
              <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fdf3e7] text-orange flex items-center justify-center mb-2 sm:mb-4">
              <Icon icon="lucide:mail" width="22" height="22" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Email</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">We reply within a few hours</p>
            <a
              href={`mailto:${siteConfig.contact.email.support}`}
              className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
            >
              <span>Send Email</span>
              <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Call Us */}
          <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#e6f0ff] text-[#0D231E] flex items-center justify-center mb-2 sm:mb-4">
              <Icon icon="lucide:phone" width="20" height="20" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Call Us</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">{siteConfig.contact.hours.weekday}</p>
            <a
              href={`tel:${siteConfig.contact.phone.supportRaw}`}
              className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
            >
              <span>Call Now</span>
              <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Our Office */}
          <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fce8e8] text-[#0D231E] flex items-center justify-center mb-2 sm:mb-4">
              <Icon icon="lucide:map-pin" width="20" height="20" />
            </div>
            <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Our Office</h3>
            <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">{siteConfig.contact.address.city}, {siteConfig.contact.address.country}</p>
            <a
              href="#map-section"
              className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
            >
              <span>View on Map</span>
              <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
