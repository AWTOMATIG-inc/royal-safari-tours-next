import { getTourLocations } from "@/actions/tour-location";
import TourPackageForm from "@/components/dashboard/tour-packages/TourPackageForm";

export default async function TourPackageCreate() {
  const results = await getTourLocations();

  return (
    <div>
      <TourPackageForm locations={results?.data || []} />
    </div>
  );
}
