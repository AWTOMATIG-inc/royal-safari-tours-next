"use client";

import logo from "@/assets/logo/royal-safari-2.png";
import royal_logo from "@/assets/logo/royal-logo.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ShapeButton from "@/components/ShapeButton";
import { PaymentIcon } from "./svg-icons";

const helperLinks = [
  { id: 0, label: "Home", link: "/" },
  { id: 1, label: "Adventure", link: "/adventure" },
  { id: 2, label: "About Us", link: "/about-us" },
  { id: 3, label: "Contact Us", link: "/contact" },
];

const countryLinks = [
  { id: 1, label: "Bangladesh", link: "/adventure" }, // Links mapped to adventure search
  { id: 2, label: "Thailand", link: "/adventure" },
  { id: 3, label: "Nepal", link: "/adventure" },
  { id: 4, label: "Singapore", link: "/adventure" },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Please add your name");
    }
    if (!email.trim()) {
      return toast.error("Please add a valid email");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    if (!isValid) {
      return toast.error("Please add a valid email");
    }
    try {
      const res = await fetch("/api/subscriber", {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 409) {
        setEmail("");
        setName("");
        return toast.error("You have already subscribed!");
      }
      setEmail("");
      setName("");
      return toast.success("Subscribed successfully!");
    } catch (error) {
      console.error(error);
      return toast.error("Something went wrong. Please try again.");
    }
  };

  // Hide footer inside dashboard views
  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-body text-[#0D231E] border-t border-[#0D231E]/8 font-calibre relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 pt-16 sm:pt-24 pb-8">

        {/* ROW 1: BRAND LOGO, MENU LINKS & OFFICE ADDRESS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 text-left">

          {/* Column 1 - Logo and branding */}
          <div className="lg:col-span-4 flex flex-col items-start max-w-sm">
            <Link href="/" className="mb-5 block">
              <Image
                loading="eager"
                src={royal_logo}
                alt="Royal Safari Tours"
                className="w-28 sm:w-32 h-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#0D231E]/90 leading-relaxed font-light mb-6">
              Crafting premium regional expeditions and heartfelt hospitality across South Asia and beyond. Founded by passionate travelers to inspire and rejuvenate.
            </p>

            {/* Outline Social Icons */}
            <ul className="flex items-center gap-2.5">
              {[
                { icon: "uiw:facebook", url: "https://www.facebook.com/royalsafaritour", label: "Facebook" },
                { icon: "mdi:instagram", url: "https://www.instagram.com/royal.safari.tours?igsh=ZmU3YXkxbzdxMDlt", label: "Instagram" },
                { icon: "prime:twitter", url: "#", label: "Twitter" },
                { icon: "mdi:youtube", url: "#", label: "YouTube" }
              ].map((social, idx) => (
                <li key={idx}>
                  <a
                    href={social.url}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[#0D231E]/15 text-[#0D231E]/70 hover:text-[#DE8D3D] hover:border-[#DE8D3D] hover:bg-[#DE8D3D]/5 transition-all duration-300"
                    target={social.url !== "#" ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={`Follow Royal Safari Tours on ${social.label}`}
                  >
                    <Icon icon={social.icon} width="16" height="16" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Menu Links (Explore) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold tracking-[0.2em] text-[#0D231E] uppercase mb-4 sm:mb-5">
              Explore
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] sm:text-sm font-semibold tracking-wide uppercase">
              {helperLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.link} className="text-[#0D231E]/80 hover:text-[#DE8D3D] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Menu Links (Destinations) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold tracking-[0.2em] text-[#0D231E] uppercase mb-4 sm:mb-5">
              Destinations
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] sm:text-sm font-semibold tracking-wide uppercase">
              {countryLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.link} className="text-[#0D231E]/80 hover:text-[#DE8D3D] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Office address */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-sm font-light text-[#0D231E]/90 leading-relaxed">
            <h5 className="text-xs font-bold tracking-[0.2em] text-[#0D231E] uppercase mb-1 sm:mb-2">
              Office Support
            </h5>

            <div className="flex flex-col gap-2.5">
              <a href="tel:+8801898334722" className="flex items-center gap-2 hover:text-[#DE8D3D] transition-colors">
                <Icon icon="lucide:phone" width="14" height="14" className="text-[#DE8D3D]" />
                <span className="font-semibold">+880 1898 334722</span>
              </a>

              <a href="mailto:info.royalsafaritours@gmail.com" className="flex items-center gap-2 hover:text-[#DE8D3D] transition-colors">
                <Icon icon="lucide:mail" width="14" height="14" className="text-[#DE8D3D]" />
                <span>info.royalsafaritours@gmail.com</span>
              </a>

              <div className="flex items-start gap-2">
                <Icon icon="lucide:map-pin" width="14" height="14" className="text-[#DE8D3D] mt-0.5" />
                <span>212, Taltola City Super Market, Khilgaon, Dhaka 1219</span>
              </div>

              <div className="flex items-center gap-2 text-[#0D231E]/70 text-[12px] mt-1 font-normal">
                <Icon icon="lucide:clock" width="13" height="13" />
                <span>Hours: Mon - Sun, 8AM - 10PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: THE NEWSLETTER SECTION (SUBSCRIBE TO OUR DISPATCH) */}
        <div className="border-t border-[#0D231E]/10 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">

            <div className="lg:col-span-5 max-w-md">
              <h4 className="text-xl sm:text-[22px] md:text-2xl font-bold tracking-tight text-[#0D231E] mb-2 font-playfair">
                Subscribe to our Dispatch
              </h4>
              <p className="text-sm text-[#0D231E] leading-relaxed font-light">
                Receive curated travel narratives, regional updates, and seasonal tour schedules directly in your inbox.
              </p>
            </div>

            <div className="lg:col-span-7 w-full">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
                <div className="relative flex-1 bg-white/40 border border-[#0D231E]/10 rounded-[12px] px-4 py-2.5 flex items-center gap-3 focus-within:border-[#DE8D3D] focus-within:bg-white transition-all duration-300">
                  <Icon icon="lucide:user" width="15" height="15" className="text-[#0D231E]/50" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-[#0D231E] font-calibre text-sm placeholder:text-[#0D231E]/40 focus:outline-none"
                  />
                </div>
                <div className="relative flex-1 bg-white/40 border border-[#0D231E]/10 rounded-[12px] px-4 py-2.5 flex items-center gap-3 focus-within:border-[#DE8D3D] focus-within:bg-white transition-all duration-300">
                  <Icon icon="lucide:mail" width="15" height="15" className="text-[#0D231E]/50" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[#0D231E] font-calibre text-sm placeholder:text-[#0D231E]/40 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0D231E] hover:bg-[#DE8D3D] text-white text-xs font-bold tracking-widest py-3.5 px-6 rounded-[12px] transition-all duration-300 uppercase shadow-sm hover:shadow hover:scale-[1.01] cursor-pointer flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* ROW 3: COPYRIGHT, CREDITS & PAYMENTS */}
        <div className="pt-8 border-t border-[#0D231E]/10 flex flex-col md:flex-row items-center gap-4 justify-between text-[13px] text-[#0D231E]/60 font-light">

          <div className="flex text-[#0D231E] font-normal flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 Royal Safari Tours. All Rights Reserved.</span>
            <span className="hidden sm:inline text-[#0D231E]/20">|</span>
            <span>
              Powered by{" "}
              <a
                className="text-orange font-bold"
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
