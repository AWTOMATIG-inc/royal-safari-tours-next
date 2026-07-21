import AdventureHero from "@/components/pages/adventure/AdventureHero";
import AdventureDiscovery from "@/components/pages/adventure/AdventureDiscovery";
import FeaturedAdventures from "@/components/pages/adventure/FeaturedAdventures";
import ExploreWays from "@/components/pages/adventure/ExploreWays";
import AllAdventureCollection from "@/components/pages/adventure/AllAdventureCollection";
import WildStories from "@/components/pages/adventure/WildStories";
import WhyAdventureWithUs from "@/components/pages/adventure/WhyAdventureWithUs";
import AdventureTestimonials from "@/components/pages/adventure/AdventureTestimonials";
import AdventureFinalCTA from "@/components/pages/adventure/AdventureFinalCTA";

export const metadata = {
  title: "Adventure Expeditions | Royal Safari Tours",
  description:
    "Discover hand-crafted wilderness adventures, high mountain treks, mangrove boat safaris, and coastal expeditions in Bangladesh.",
};

export default function AdventurePage() {
  return (
    <main className="bg-white min-h-screen">
      <AdventureHero />
      <AdventureDiscovery />
      <FeaturedAdventures />
      <ExploreWays />
      <AllAdventureCollection />
      <WildStories />
      <WhyAdventureWithUs />
      <AdventureTestimonials />
      <AdventureFinalCTA />
    </main>
  );
}
