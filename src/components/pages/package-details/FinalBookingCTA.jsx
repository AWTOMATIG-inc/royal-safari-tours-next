"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function FinalBookingCTA({ tourPackage, onOpenBooking }) {
  if (!tourPackage) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I am ready to book: "${tourPackage.title}".`
  );

  return (
    <section className="relative py-20 sm:py-28 bg-black text-white overflow-hidden">
      <Image
        src="/images/banners/contact.webp"
        alt="Wilderness Adventure"
        fill
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-3xl space-y-6">
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase font-inter">
          <Icon icon="lucide:compass" className="w-4 h-4 text-[#DE8D3D]" />
          UNFORGETTABLE JOURNEYS AWAIT
        </span>

        <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white leading-tight">
          Ready for Your Next <br />
          <span className="italic font-normal text-[#DE8D3D]">Wilderness Expedition?</span>
        </h2>

        <p className="text-sm sm:text-base text-white/80 font-light font-inter max-w-xl mx-auto leading-relaxed">
          Book your spot on &quot;{tourPackage.title}&quot; today. Starting from ৳{Number(tourPackage.price).toLocaleString()} per person.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-inter">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <span>Book This Tour</span>
            <Icon icon="lucide:arrow-right" className="w-4 h-4" />
          </button>

          <a
            href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer backdrop-blur-md"
          >
            <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
