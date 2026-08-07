import { getTourLocationsByPagination } from "@/actions/tour-location";
import TourLocationCardPage from "@/components/dashboard/location/TourLocationPage";
import toast from "react-hot-toast";
export default async function TourLocation({ searchParams }) {
  const { page } = await searchParams;
  const results = await getTourLocationsByPagination(page);
  if (!results.success) {
    return toast.error(results.message);
  }
  return (
    <div>
      <TourLocationCardPage
        tourPackages={results.data}
        pagination={results.pagination}
      />
    </div>
  );
}
