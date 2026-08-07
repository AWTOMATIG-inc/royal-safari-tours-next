import { getTourLocations } from "@/actions/tour-location";
import TourPackageForm from "@/components/dashboard/tour-packages/TourPackageForm";
import toast from "react-hot-toast";

export default async function BlogEdit() {
  const results = await getTourLocations();
  if (!results.success) {
    return toast.error(results.message || "Failed to fetch locations");
  }
  return (
    <div>
      <TourPackageForm locations={results.data} />
    </div>
  );
}
