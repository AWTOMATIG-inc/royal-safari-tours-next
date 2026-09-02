import { getTourLocationsByPagination } from "@/actions/tour-location";
import TourLocationCardPage from "@/components/dashboard/location/TourLocationPage";

export default async function TourLocation({ searchParams }) {
  const { page } = await searchParams;
  const results = await getTourLocationsByPagination(page);

  return (
    <div>
      <TourLocationCardPage
        tourPackages={results?.data || []}
        pagination={results?.pagination}
      />
    </div>
  );
}
