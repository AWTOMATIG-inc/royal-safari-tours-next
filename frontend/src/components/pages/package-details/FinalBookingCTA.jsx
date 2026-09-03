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
    <section className="relative section-lg bg-black text-white overflow-hidden font-body">
      <Image
        src="/images/banners/contact_hero.webp"
        alt="Wilderness Adventure"
        fill
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      <div className="relative z-10 container text-center max-w-3xl space-y-6 font-body">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-accent uppercase font-accent">
          <Icon icon="lucide:compass" className="w-4 h-4 text-accent" />
          UNFORGETTABLE JOURNEYS AWAIT
        </span>

        <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-tight">
          Ready for Your Next <br />
          <span className="italic font-normal text-accent font-heading">Wilderness Expedition?</span>
        </h2>

        <p className="text-body-lg text-white/85 font-light font-body max-w-xl mx-auto leading-relaxed">
          Book your spot on &quot;{tourPackage.title}&quot; today. Starting from ৳{Number(tourPackage.price).toLocaleString()} per person.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-body">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto bg-secondary hover:bg-accent text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-xs hover:-translate-y-0.5 font-body"
          >
            <span>Book This Tour</span>
            <Icon icon="lucide:arrow-right" className="w-4 h-4" />
          </button>

          <a
            href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer backdrop-blur-md font-body"
          >
            <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-whatsapp" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

