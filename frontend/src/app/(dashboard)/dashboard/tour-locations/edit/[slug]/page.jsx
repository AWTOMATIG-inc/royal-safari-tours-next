import { getTourLocationBySlug } from "@/actions/tour-location";
import TourLocationForm from "@/components/dashboard/location/TourLocationForm";

export default async function BlogEdit({ params }) {
  const { slug } = await params;
  const result = await getTourLocationBySlug(slug);

  return (
    <div>
      <TourLocationForm location={result?.data} />
    </div>
  );
}
