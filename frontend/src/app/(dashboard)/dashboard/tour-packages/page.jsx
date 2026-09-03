import { getTourPackages } from "@/actions/tour-package";
import TourCardPage from "@/components/dashboard/tour-packages/TourCardPage";

export default async function TourPackages({ searchParams }) {
  const { page } = await searchParams;
  const results = await getTourPackages(page, 50, "all");

  return (
    <div>
      <TourCardPage
        tourPackages={results?.data || []}
        pagination={results?.pagination}
      />
    </div>
  );
}
