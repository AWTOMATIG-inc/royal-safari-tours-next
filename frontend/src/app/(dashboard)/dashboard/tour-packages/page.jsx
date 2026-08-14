import { getTourPackages } from "@/actions/tour-package";
import TourCardPage from "@/components/dashboard/tour-packages/TourCardPage";
import toast from "react-hot-toast";
export default async function TourPackages({ searchParams }) {
  const { page} = await searchParams;
  const results= await getTourPackages( page);
  if (!results.success) {
    return toast.error("Failed to fetch tour packages");
  }

  return (
    <div>
      <TourCardPage tourPackages={results.data} pagination={results.pagination} />
    </div>
  );
}
