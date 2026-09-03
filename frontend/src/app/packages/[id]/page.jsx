import { getTourPackageBySlug } from "@/actions/tour-package";
import TourDetailsClientPage from "@/components/pages/package-details/TourDetailsClientPage";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getTourPackageBySlug(id);

  if (!result?.success || !result?.data) {
    return {
      title: "Tour Package | Royal Safari Tours",
    };
  }

  const tour = result.data;
  if (tour.isPublished === false) {
    return {
      title: "Tour Currently Unavailable | Royal Safari Tours",
      description: "This expedition is currently unavailable or undergoing seasonal schedule updates.",
    };
  }

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

  const tour = result.data;

  // If tour is unpublished, display luxury unavailable notice
  if (tour.isPublished === false) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 py-16 px-4 font-inter">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-[0_10px_40px_rgba(13,35,30,0.06)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Icon icon="lucide:compass" className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold tracking-wider uppercase">
              Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E]">
              This Tour is Currently Unavailable
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
              The expedition itinerary &ldquo;{tour.title}&rdquo; is temporarily archived or undergoing seasonal route and schedule adjustments.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/adventure"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0D231E] text-white text-xs sm:text-sm font-semibold hover:bg-[#2cb775] transition-colors shadow-sm text-center"
            >
              Explore Active Tours
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <TourDetailsClientPage tourPackage={tour} />;
}
