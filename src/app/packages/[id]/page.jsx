import { getTourPackageBySlug } from "@/actions/tour-package";
import TourDetailsClientPage from "@/components/pages/package-details/TourDetailsClientPage";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getTourPackageBySlug(id);

  if (!result?.success || !result?.data) {
    return {
      title: "Tour Package | Royal Safari Tours",
    };
  }

  const tour = result.data;
  return {
    title: `${tour.title} | Royal Safari Tours`,
    description: tour.shortDescription || tour.title,
    openGraph: {
      title: `${tour.title} | Royal Safari Tours`,
      description: tour.shortDescription || tour.title,
      images: [
        tour.image?.startsWith("/")
          ? tour.image
          : `/api/uploads/tour-packages/${tour.image}`,
      ],
    },
  };
}

export default async function PackageDetailsPage({ params }) {
  const { id } = await params;
  const result = await getTourPackageBySlug(id);

  if (!result?.success || !result?.data) {
    notFound();
  }

  return <TourDetailsClientPage tourPackage={result.data} />;
}
