import { getTourLocationBySlug } from "@/actions/tour-location";
import TourLocationForm from "@/components/dashboard/location/TourLocationForm";
import toast from "react-hot-toast";

export default async function BlogEdit({ params }) {
  const { slug } = await params;
  const result = await getTourLocationBySlug(slug);
  if (!result.success) {
    return toast.error(result.message);
  }
  return (
    <div>
      <TourLocationForm location={result.data} />
    </div>
  );
}
