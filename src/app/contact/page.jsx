"use client";

import ContactHero from "@/components/pages/contact/ContactHero";
import ContactQuickCards from "@/components/pages/contact/ContactQuickCards";
import ContactFormSection from "@/components/pages/contact/ContactFormSection";
import ContactWhyChooseUs from "@/components/pages/contact/ContactWhyChooseUs";
import ContactMapSection from "@/components/pages/contact/ContactMapSection";
import ContactNewsletter from "@/components/pages/contact/ContactNewsletter";

export default function Contact() {
  return (
    <div className="bg-white min-h-screen text-[#132E27] font-palanquin overflow-x-hidden">
      {/* 1. Hero section & floating quick contact cards */}
      <div className="relative">
        <ContactHero />
        <ContactQuickCards />
      </div>

      {/* Spacer for overlapping contact cards */}
      <div className="h-44 sm:h-48 md:h-52 lg:h-32" />

      {/* 2. Contact form & office details */}
      <ContactFormSection />

      {/* 3. Why choose us summary bar */}
      <ContactWhyChooseUs />

      {/* 4. Google Maps section */}
      <ContactMapSection />

      {/* 5. Full width newsletter subscription footer */}
      <ContactNewsletter />
    </div>
  );
}
