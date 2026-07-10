import { getTourPackagesAndLocations } from "@/actions/tour-package";
import Gallery from "@/components/pages/home/Gallery";
import Hero from "@/components/pages/home/Hero";
import Memories from "@/components/pages/home/Memories";
import NatureAndBeyond from "@/components/pages/home/NatureAndBeyond";
import SharedStories from "@/components/pages/home/SharedStories";
import Subscription from "@/components/pages/home/Subscription";
import Testimonials from "@/components/pages/home/Testimonials";
import TourPackage from "@/components/pages/home/TourPackage";
import TravelCategory from "@/components/pages/home/TravelCategory";
import TravelPartner from "@/components/pages/home/TravelPartner";
import toast from "react-hot-toast";

export default async function Home() {
  const results = await getTourPackagesAndLocations();
  if (!results.success) {
    toast.error(results.message);
  }
  return (
    <main>
      <Hero />
      <TravelPartner />
      <SharedStories locations={results.locations} />
      {/* <Facilities /> */}
      <NatureAndBeyond
        tourPackages={results.tourPackages}
        locations={results.locations}
      />
      <TourPackage />
      <Memories />
      <TravelCategory />

      <Testimonials />
      <Subscription />
      <Gallery />
    </main>
  );
}
