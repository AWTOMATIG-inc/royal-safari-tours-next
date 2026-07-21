import { getTourPackagesAndLocations } from "@/actions/tour-package";
import AdventureClientPage from "@/components/pages/adventure/AdventureClientPage";

export const metadata = {
  title: "Adventure Expeditions & Tours | Royal Safari Tours",
  description:
    "Discover hand-crafted wilderness adventures, high mountain treks, mangrove boat safaris, and coastal expeditions.",
};

export default async function AdventurePage() {
  const results = await getTourPackagesAndLocations();

  return (
    <AdventureClientPage
      tourPackages={results?.tourPackages || []}
      locations={results?.locations || []}
    />
  );
}
