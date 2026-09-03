"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUrl";

export default function TourLocationCardPage({ locations = [], tourPackages = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const locationList = locations.length > 0 ? locations : tourPackages;
  const isPrev = Number(pagination.page || 1) === 1;
  const isNext = Number(pagination.page || 1) === Number(pagination.totalPages || 1);

  const handleOpenDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tour-location/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Tour location deleted successfully!");
      setDeleteModal({ open: false, id: null, title: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error(error.message || "Failed to delete location");
    } finally {
      setIsDeleting(false);
    }
  };

  const getLocTitle = (loc) => {
    if (!loc) return "Location";
    if (typeof loc.country === "string") return loc.country;
    if (typeof loc.title === "string") return loc.title;
    if (typeof loc.name === "string") return loc.name;
    return "Location";
  };

  const filteredLocations = tourPackages.filter((location) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const title = getLocTitle(location).toLowerCase();
    const slug = (location.slug || "").toLowerCase();
    return title.includes(q) || slug.includes(q);
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Tour Locations"
        description="Manage destination regions, mangrove reserves, tea estates, and coastal sanctuaries."
        actionText="Create New Location"
        actionHref="/dashboard/tour-locations/create"
        actionIcon="lucide:map-pin"
      />

      {/* Independent Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Icon
            icon="lucide:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations by country..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="text-xs text-gray-500 font-medium self-start sm:self-center">
            Found <span className="font-bold text-[#0D231E]">{filteredLocations.length}</span> matching location(s)
          </div>
        )}
      </div>

      {tourPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <Image
            src="/images/placeholders/empty_state.png"
            width={300}
            height={300}
            priority
            alt="Empty state"
            className="mx-auto opacity-80"
          />
          <p className="text-gray-500 font-medium text-base">
            No locations found. Click above to create your first destination.
          </p>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <Icon icon="lucide:search-x" className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium text-base">
            No locations match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLocations.map((location, idx) => {
            const locId = location.id || `loc-${idx}`;
            const title = getLocTitle(location);
            const imageSrc = getImageUrl(location.image || location.banner, "/images/banners/travel_inspiration.webp");
            const locSlug = location.slug || locId;

            return (
              <div
                key={locId}
                className="group bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(13,35,30,0.03)] hover:shadow-[0_8px_24px_rgba(13,35,30,0.06)] overflow-hidden transition-all duration-300 flex flex-col justify-between p-3.5 space-y-2.5"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-50">
                    <Image
                      src={imageSrc}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      alt={title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-[9px] tracking-wider uppercase">
                      Location
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-[#0D231E] capitalize group-hover:text-[#2cb775] transition-colors line-clamp-1">
                      {title}
                    </h3>
                    {location.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {location.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={locSlug}>
                    {locSlug}
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/tour-locations/edit/${locSlug}`}
                      className="p-1.5 rounded-md bg-gray-50 text-gray-600 hover:bg-[#2cb775]/10 hover:text-[#2cb775] transition-colors"
                      title="Edit location"
                    >
                      <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenDeleteModal(locId, title)}
                      className="p-1.5 rounded-md bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete location"
                    >
                      <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && !searchQuery && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={
              isPrev
                ? "/dashboard/tour-locations?page=1"
                : `/dashboard/tour-locations?page=${Number(pagination.page) - 1}`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              isPrev
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/dashboard/tour-locations?page=${i + 1}`}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                Number(pagination.page) === i + 1
                  ? "bg-[#0D231E] text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
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
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              isNext
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Next
          </Link>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Location"
        message={`Are you sure you want to delete ${deleteModal.title ? `"${deleteModal.title}"` : "this location"}? This action cannot be undone.`}
        confirmText="Delete Location"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
