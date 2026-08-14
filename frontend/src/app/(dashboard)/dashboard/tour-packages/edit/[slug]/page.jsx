import { getTourPackageWithSlugAndLocations } from "@/actions/tour-package";
import TourPackageForm from "@/components/dashboard/tour-packages/TourPackageForm";
import toast from "react-hot-toast";

export default async function TourPackageEdit({ params }) {
  const { slug } = await params;
  const results= await getTourPackageWithSlugAndLocations(slug);
    if (!results.success) {
      return toast.error(results.message || "Failed to fetch tour package details");
    }
  return (
    <div>
      <TourPackageForm tourPackage={results?.tourPackage} locations={results?.locations} />
    </div>
  );
}