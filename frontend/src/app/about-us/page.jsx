import Hero from "@/components/pages/about-us/Hero";
import WhoWeAre from "@/components/pages/about-us/WhoWeAre";
import WhatWeOffer from "@/components/pages/about-us/WhatWeOffer";
import WhyTravelWithUs from "@/components/pages/about-us/WhyTravelWithUs";
import CustomerSays from "@/components/pages/about-us/CustomerSays";
import OurPartners from "@/components/pages/about-us/OurPartners";
import FinalCTA from "@/components/pages/about-us/FinalCTA";

export const metadata = {
  title: "About Us | Royal Safari Tours",
  description: "Learn about the mission, values, and curated luxury travel offerings of Royal Safari Tours. We craft bespoke, authentic expeditions across Bangladesh and beyond.",
};

export default function AboutUs() {
  return (
    <main className="bg-white min-h-screen">
      <Hero />
      <WhoWeAre />
      <WhatWeOffer />
      <WhyTravelWithUs />
      <CustomerSays />
      <OurPartners />
      <FinalCTA />
    </main>
  );
}
