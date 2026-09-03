import { getTourPackageWithSlugAndLocations } from "@/actions/tour-package";
import TourPackageForm from "@/components/dashboard/tour-packages/TourPackageForm";

export default async function TourPackageEdit({ params }) {
  const { slug } = await params;
  const results = await getTourPackageWithSlugAndLocations(slug);

  return (
    <div>
      <TourPackageForm
        tourPackage={results?.tourPackage}
        locations={results?.locations || []}
      />
    </div>
  );
}