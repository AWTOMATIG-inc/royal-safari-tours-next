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

export default function TourCardPage({ tourPackages = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const isPrev = Number(pagination.page || 1) === 1;
  const isNext = Number(pagination.page || 1) === Number(pagination.totalPages || 1);

  const handleOpenDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tour-package/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      toast.success("Tour package deleted successfully!");
      setDeleteModal({ open: false, id: null, title: "" });
      router.refresh();
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getLocationStr = (pkg) => {
    if (!pkg) return "";
    if (pkg.locationName) return pkg.locationName;
    if (typeof pkg.location === "string") return pkg.location;
    if (pkg.location && typeof pkg.location === "object") {
      return pkg.location.country || pkg.location.name || pkg.location.title || "";
    }
    return "";
  };

  const [togglingId, setTogglingId] = useState(null);

  const handleTogglePublish = async (pkg) => {
    const pkgId = pkg.id;
    if (!pkgId) return;
    setTogglingId(pkgId);
    try {
      const newStatus = !pkg.isPublished;
      const res = await fetch(`/api/tour-package/${pkgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || "Failed to update package status");
      }
      toast.success(newStatus ? "Package published successfully!" : "Package unpublished successfully!");
      router.refresh();
    } catch (error) {
      console.error("Toggle publish failed:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCopyLink = async (slug) => {
    try {
      const publicUrl = `${window.location.origin}/packages/${slug}`;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = publicUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Package URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const filteredPackages = tourPackages.filter((pkg) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const title = (pkg.title || "").toLowerCase();
    const loc = getLocationStr(pkg).toLowerCase();
    const shortDesc = (pkg.shortDescription || "").toLowerCase();
    const desc = (pkg.description || "").toLowerCase();
    const priceStr = String(pkg.price || "");
    return title.includes(q) || loc.includes(q) || shortDesc.includes(q) || desc.includes(q) || priceStr.includes(q);
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Tour Packages"
        description="Create, edit, and manage all luxury travel itineraries and price options."
        actionText="Create New Package"
        actionHref="/dashboard/tour-packages/create"
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
            placeholder="Search packages by title, location..."
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
            Found <span className="font-bold text-[#0D231E]">{filteredPackages.length}</span> matching package(s)
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
            No tour packages found. Click above to create your first package.
          </p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4">
          <Icon icon="lucide:search-x" className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium text-base">
            No tour packages match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPackages.map((pkg, idx) => {
            const pkgId = pkg.id || `pkg-${idx}`;
            const imageSrc = getImageUrl(pkg.featuredImage || pkg.image, "/images/banners/home_hero.webp");
            const locDisplay = getLocationStr(pkg);
            const pkgSlug = pkg.slug || pkgId;
            const isPublished = pkg.isPublished !== false;

            return (
              <div
                key={pkgId}
                className="group bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(13,35,30,0.03)] hover:shadow-[0_8px_24px_rgba(13,35,30,0.06)] p-3.5 flex flex-col sm:flex-row gap-3.5 items-center justify-between transition-all duration-300"
              >
                {/* Left: Image */}
                <div className="relative w-full sm:w-36 md:w-40 aspect-[16/11] sm:aspect-[4/3] shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={imageSrc}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    alt={pkg.title || "Tour Package"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md ${
                      isPublished
                        ? "bg-emerald-900/80 text-emerald-100"
                        : "bg-amber-900/80 text-amber-100"
                    }`}
                  >
                    {isPublished ? "Published" : "Unpublished"}
                  </div>
                </div>

                {/* Right: Details & Action Buttons */}
                <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch space-y-2">
                  {/* Title & Price */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-semibold text-sm sm:text-base text-[#0D231E] truncate group-hover:text-[#2cb775] transition-colors"
                        title={pkg.title}
                      >
                        {pkg.title}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm sm:text-base text-[#0D231E] font-mono">
                          ৳{Number(pkg.price || 0).toLocaleString()}
                        </span>
                        {pkg.discountPrice && (
                          <span className="block text-[10px] text-gray-400 line-through font-mono">
                            ৳{Number(pkg.discountPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & Duration */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      {locDisplay && (
                        <span className="flex items-center gap-1 truncate max-w-[150px]" title={locDisplay}>
                          <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-[#2cb775] shrink-0" />
                          <span className="capitalize truncate">{locDisplay}</span>
                        </span>
                      )}
                      {pkg.duration && (
                        <span className="flex items-center gap-1 shrink-0">
                          <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-gray-400" />
                          <span>{pkg.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-mono truncate max-w-[100px] hidden sm:inline" title={pkgSlug}>
                      {pkgSlug}
                    </span>

                    <div className="flex items-center gap-1 ml-auto flex-wrap">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(pkgSlug)}
                        className="px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy public tour link"
                      >
                        <Icon icon="lucide:copy" className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      {/* Unpublish / Publish Toggle Button */}
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        disabled={togglingId === pkgId}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                          isPublished
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50"
                        }`}
                        title={isPublished ? "Unpublish tour package" : "Publish tour package"}
                      >
                        {togglingId === pkgId ? (
                          <Icon icon="lucide:loader-2" className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Icon icon={isPublished ? "lucide:eye-off" : "lucide:eye"} className="w-3.5 h-3.5" />
                        )}
                        <span>{isPublished ? "Unpublish" : "Publish"}</span>
                      </button>

                      {/* Edit Button */}
                      <Link
                        href={`/dashboard/tour-packages/edit/${pkgSlug}`}
                        className="px-2 py-1 rounded-md bg-gray-50 text-gray-600 hover:bg-[#2cb775]/10 hover:text-[#2cb775] transition-colors flex items-center gap-1 text-xs font-medium"
                        title="Edit package"
                      >
                        <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleOpenDeleteModal(pkgId, pkg.title)}
                        className="px-2 py-1 rounded-md bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                        title="Delete package"
                      >
                        <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && !searchQuery && (
        <div className="flex justify-center items-center gap-2 pt-4 font-inter">
          <Link
            href={
              isPrev
                ? "/dashboard/tour-packages?page=1"
                : `/dashboard/tour-packages?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/tour-packages?page=${i + 1}`}
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
                ? `/dashboard/tour-packages?page=${pagination.totalPages}`
                : `/dashboard/tour-packages?page=${Number(pagination.page) + 1}`
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
        title="Delete Tour Package"
        message={`Are you sure you want to delete ${deleteModal.title ? `"${deleteModal.title}"` : "this tour package"}? This action cannot be undone.`}
        confirmText="Delete Package"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
