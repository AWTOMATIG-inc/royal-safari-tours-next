"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function StickyBookingBar({ tourPackage, onOpenBooking }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isVisible = window.scrollY > 550;
      setVisible((prev) => (prev !== isVisible ? isVisible : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!tourPackage || !visible) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I want to book: "${tourPackage.title}".`
  );

  return (
    <>
      {/* DESKTOP STICKY BAR */}
      <div className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 z-[990] w-full max-w-5xl px-4 transition-all duration-300 ease-out font-body transform-gpu">
        <div className="bg-[#0D231E]/95 border border-white/15 rounded-2xl shadow-xl px-6 py-3.5 flex items-center justify-between text-white font-body">
          
          <div className="flex items-center gap-4 truncate max-w-md font-body">
            <h4 className="font-heading text-lg font-bold truncate text-white">
              {tourPackage.title}
            </h4>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 shrink-0 font-body">
              ⏱ {tourPackage.duration}
            </span>
          </div>

          <div className="flex items-center gap-6 font-body">
            <div className="flex flex-col text-right font-body">
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider font-body">
                Price Per Guest
              </span>
              <span className="text-lg font-bold text-accent font-heading">
                ৳{Number(tourPackage.price).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 font-body">
              <a
                href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors font-body"
                title="Message on WhatsApp"
              >
                <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-whatsapp" />
              </a>

              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer font-body flex items-center gap-2"
              >
                <span>Book Now</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[990] bg-[#0D231E]/95 border-t border-white/15 p-3.5 shadow-2xl font-body transform-gpu">
        <div className="flex items-center justify-between gap-3 font-body">
          <div className="flex flex-col font-body">
            <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider font-body">
              Starting Price
            </span>
            <span className="text-base font-bold text-accent font-heading">
              ৳{Number(tourPackage.price).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 font-body">
            <a
              href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/10 text-white flex items-center justify-center font-body"
            >
              <Icon icon="akar-icons:whatsapp-fill" className="w-4 h-4 text-whatsapp" />
            </a>

            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold flex items-center gap-1.5 font-body"
            >
              <span>Book Now</span>
              <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
