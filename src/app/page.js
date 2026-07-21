import { getTourPackagesAndLocations } from "@/actions/tour-package";
import Hero from "@/components/pages/home/Hero";
import FeaturedDestinations from "@/components/pages/home/FeaturedDestinations";
import FeaturedExperiences from "@/components/pages/home/FeaturedExperiences";
import WhyRoyalSafari from "@/components/pages/home/WhyRoyalSafari";
import AboutPreview from "@/components/pages/home/AboutPreview";
import TravelInspiration from "@/components/pages/home/TravelInspiration";
import CustomerStories from "@/components/pages/home/CustomerStories";
import TrustedPartners from "@/components/pages/home/TrustedPartners";
import Newsletter from "@/components/pages/home/Newsletter";

export const metadata = {
  title: "Royal Safari Tours | Luxury Travel & Bespoke Expeditions",
  description:
    "Experience hand-crafted, low-impact luxury expeditions through Bangladesh's pristine mangroves, tea valleys, and coastal sanctuaries.",
};

export default async function Home() {
  const results = await getTourPackagesAndLocations();

  return (
    <main className="bg-white min-h-screen">
      <Hero />
      <FeaturedDestinations locations={results?.locations || []} />
      <FeaturedExperiences tourPackages={results?.tourPackages || []} />
      <WhyRoyalSafari />
      <AboutPreview />
      <TravelInspiration />
      <CustomerStories />
      <TrustedPartners />
      <Newsletter />
    </main>
  );
}
