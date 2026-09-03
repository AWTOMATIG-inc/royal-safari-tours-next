"use client";

import royal_logo from "../../public/images/branding/royal_logo.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaymentIcon } from "./svg-icons";
import ContactNewsletter from "@/components/pages/contact/ContactNewsletter";
import { Reveal } from "@/components/animations";

import { siteConfig } from "@/config/siteConfig";
import { navigationConfig } from "@/config/navigationConfig";

const helperLinks = navigationConfig.footerExplore;
const countryLinks = navigationConfig.footerDestinations;

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside dashboard views
  if (pathname?.includes("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-body text-primary font-body relative overflow-hidden">
      {/* 1. TOP NEWSLETTER BANNER */}
      <ContactNewsletter />

      <div className="container pt-14 sm:pt-20 pb-8">

        {/* ROW 1: BRAND LOGO, MENU LINKS & OFFICE ADDRESS */}
        <Reveal variant="fadeUp" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 text-left">

          {/* Column 1 - Logo and branding */}
          <div className="lg:col-span-4 flex flex-col items-start max-w-sm">
            <Link href="/" className="mb-5 block">
              <Image
                loading="eager"
                src={royal_logo}
                alt="Royal Safari Tours"
                width={200}
                height={60}
                className="w-28 sm:w-32 h-auto object-contain"
              />
            </Link>
            <p className="text-sm text-primary/80 leading-relaxed font-light mb-6">
              {siteConfig.fullDescription}
            </p>

            {/* Social Icons */}
            <ul className="flex items-center gap-2.5">
              {siteConfig.socials.map((social, idx) => (
                <li key={idx}>
                  <a
                    href={social.url}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-primary/15 text-primary/70 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all duration-300"
                    target={social.url !== "#" ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={`Follow ${siteConfig.name} on ${social.name}`}
                  >
                    <Icon icon={social.icon} width="16" height="16" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Menu Links (Explore) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-5 font-body">
              Explore
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] sm:text-sm font-medium tracking-wide font-body">
              {helperLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.link} className="text-primary/80 hover:text-accent transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Menu Links (Destinations) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-5 font-body">
              Destinations
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] sm:text-sm font-medium tracking-wide font-body">
              {countryLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.link} className="text-primary/80 hover:text-accent transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Office address */}
          <div className="lg:col-span-4 flex flex-col text-sm font-light text-primary/90 leading-relaxed font-body">
            <h5 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-5 font-body">
              Office Support
            </h5>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <a href={`tel:${siteConfig.contact.phone.primaryRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                  <Icon icon="lucide:phone" width="16" height="16" className="text-accent flex-shrink-0" />
                  <span className="font-semibold">{siteConfig.contact.phone.primary}</span>
                </a>
                <a href={`tel:${siteConfig.contact.phone.secondaryRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors pl-7">
                  <span className="font-semibold">{siteConfig.contact.phone.secondary}</span>
                </a>
              </div>

              <a href={`mailto:${siteConfig.contact.email.info}`} className="flex items-center gap-3 hover:text-accent transition-colors font-semibold">
                <Icon icon="lucide:mail" width="16" height="16" className="text-accent flex-shrink-0" />
                <span>{siteConfig.contact.email.info}</span>
              </a>

              <div className="flex items-start gap-3">
                <Icon icon="lucide:map-pin" width="16" height="16" className="text-accent mt-0.5 flex-shrink-0" />
                <span>{siteConfig.contact.address.full}</span>
              </div>

              <div className="flex items-center gap-3 text-primary/70 text-[13px] font-normal pt-0.5">
                <Icon icon="lucide:clock" width="15" height="15" className="text-accent/80 flex-shrink-0" />
                <span>{siteConfig.contact.hours.weekday}</span>
              </div>
            </div>
          </div>

        </Reveal>

        {/* ROW 2: COPYRIGHT, CREDITS & PAYMENTS */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center gap-4 justify-between text-[13px] text-primary/60 font-light font-body">

          <div className="flex text-primary font-normal flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 Royal Safari Tours. All Rights Reserved.</span>
            <span className="hidden sm:inline text-primary/20">|</span>
            <span>
              Powered by{" "}
              <a
                className="text-[#02D5E7] font-bold"
                href="https://awtomatig.com/"
                target="_blank"
                rel="noreferrer"
              >
                AWTOMATIG
              </a>
            </span>
          </div>

          <div className="flex items-center">
            <PaymentIcon className="scale-95" />
          </div>

        </div>

      </div>
    </footer>
  );
}


