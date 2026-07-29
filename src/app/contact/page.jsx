"use client";

import ContactHero from "@/components/pages/contact/ContactHero";
import ContactQuickCards from "@/components/pages/contact/ContactQuickCards";
import ContactFormSection from "@/components/pages/contact/ContactFormSection";
import ContactWhyChooseUs from "@/components/pages/contact/ContactWhyChooseUs";
import ContactMapSection from "@/components/pages/contact/ContactMapSection";

export default function Contact() {
  return (
    <div className="bg-white min-h-screen text-primary font-body overflow-x-hidden">
      {/* 1. Hero section & floating quick contact cards */}
      <div className="relative">
        <ContactHero />
        <ContactQuickCards />
      </div>

      {/* Spacer for overlapping contact cards */}
      <div className="h-28 sm:h-32 md:h-36" />

      {/* 2. Contact form & office details */}
      <ContactFormSection />

      {/* 3. Why choose us summary bar */}
      <ContactWhyChooseUs />

      {/* 4. Google Maps section */}
      <ContactMapSection />
    </div>
  );
}

