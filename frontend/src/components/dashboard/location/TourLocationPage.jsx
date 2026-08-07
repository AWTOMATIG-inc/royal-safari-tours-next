"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TourLocationCardPage({ tourPackages = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this location?");
    if (!userConfirmed) return;
    try {
      const res = await fetch(`/api/tour-location/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Tour location deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Tour Locations"
        description="Manage destination regions, mangrove reserves, tea estates, and coastal sanctuaries."
        actionText="Create New Location"
        actionHref="/dashboard/tour-locations/create"
        actionIcon="lucide:map-pin"
      />

      {tourPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <Image
            src="/images/dashboard/empty.png"
            width={300}
            height={300}
            priority
            alt="Empty state"
            className="mx-auto opacity-80"
          />
          <p className="text-gray-500 font-medium font-inter text-base">
            No locations found. Click above to create your first destination.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourPackages.map((location) => {
            const title = location.country || location.title || location.name || "Location";
            const imageSrc = location.image?.startsWith("http") || location.image?.startsWith("/")
              ? location.image
              : `/api/uploads/locations/${location.image}`;

            return (
              <div
                key={location._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.08)] overflow-hidden transition-all duration-300 flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={imageSrc}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-[10px] tracking-wider uppercase">
                      Expedition Region
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#0D231E] font-inter group-hover:text-[#2cb775] transition-colors">
                      {title}
                    </h3>
                    {location.description && (
                      <p className="text-xs text-gray-500 font-inter line-clamp-2 mt-1">
                        {location.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-inter">
                    Slug: <code className="text-[#0D231E]">{location.slug || title.toLowerCase()}</code>
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/tour-locations/edit/${location.slug}`}
                      className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Edit location"
                    >
                      <Icon icon="lucide:pencil" className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(location._id)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete location"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <Link
            href={
              isPrev
                ? "/dashboard/tour-locations?page=1"
                : `/dashboard/tour-locations?page=${Number(pagination.page) - 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
              isPrev
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/dashboard/tour-locations?page=${i + 1}`}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold font-inter transition-all ${
                pagination.page.toString() === (i + 1).toString()
                  ? "bg-[#0D231E] border-[#0D231E] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </Link>
          ))}

          <Link
            href={
              isNext
                ? `/dashboard/tour-locations?page=${pagination.totalPages}`
                : `/dashboard/tour-locations?page=${Number(pagination.page) + 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
              isNext
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
