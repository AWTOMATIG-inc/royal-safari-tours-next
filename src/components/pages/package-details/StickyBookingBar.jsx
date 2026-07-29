"use client";

import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function StickyBookingBar({ tourPackage, onOpenBooking }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setVisible(true);
      } else {
        setVisible(false);
      }
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
      <div className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 z-[990] w-full max-w-5xl px-4 transition-all duration-500 ease-out animate-fadeIn font-body">
        <div className="bg-primary/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-xl px-6 py-3.5 flex items-center justify-between text-white font-body">
          
          <div className="flex items-center gap-4 truncate max-w-md">
            <h4 className="font-heading text-lg font-bold truncate text-white">
              {tourPackage.title}
            </h4>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 shrink-0 font-body">
              ⏱ {tourPackage.duration}
            </span>
          </div>

          <div className="flex items-center gap-6 font-body">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
                Price Per Guest
              </span>
              <span className="text-lg font-bold text-accent font-heading">
                ৳{Number(tourPackage.price).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 font-body">
              <a
                href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Chat on WhatsApp"
              >
                <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-whatsapp" />
              </a>

              <button
                onClick={onOpenBooking}
                className="bg-secondary hover:bg-accent text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider cursor-pointer shadow-xs font-body"
              >
                Book Now
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[990] bg-primary/95 backdrop-blur-xl border-t border-white/15 px-4 py-3 shadow-xl flex items-center justify-between text-white font-body">
        <div className="flex flex-col font-body">
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
            Starting From
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
            className="p-2.5 rounded-xl bg-white/10 text-white cursor-pointer"
          >
            <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-whatsapp" />
          </a>

          <button
            onClick={onOpenBooking}
            className="bg-secondary hover:bg-accent text-white text-xs font-semibold px-5 py-3 rounded-xl uppercase tracking-wider cursor-pointer shadow-xs font-body"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}

