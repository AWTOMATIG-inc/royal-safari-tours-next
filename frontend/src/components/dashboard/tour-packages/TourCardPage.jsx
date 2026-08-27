"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TourCardPage({ tourPackages = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this tour package?");
    if (!userConfirmed) return;
    try {
      const res = await fetch(`/api/tour-package/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      router.refresh();
      toast.success("Tour package deleted successfully!");
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error(error.message);
    }
  };

  const filteredPackages = tourPackages.filter((pkg) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const title = (pkg.title || "").toLowerCase();
    const location = (pkg.location || "").toLowerCase();
    const shortDesc = (pkg.shortDescription || "").toLowerCase();
    const desc = (pkg.description || "").toLowerCase();
    const priceStr = String(pkg.price || "");
    return title.includes(q) || location.includes(q) || shortDesc.includes(q) || desc.includes(q) || priceStr.includes(q);
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Tour Packages"
        description="Create, edit, and manage all luxury travel itineraries and price options."
        actionText="Create New Package"
        actionHref="/dashboard/tour-packages/create"
      />

      {/* Independent Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4 font-inter">
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
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4 font-inter">
          <Image
            src="/images/dashboard/empty.png"
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
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4 font-inter">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-inter">
          {filteredPackages.map((pkg) => {
            const imageSrc = pkg.image?.startsWith("http") || pkg.image?.startsWith("/")
              ? pkg.image
              : `/api/uploads/tour-packages/${pkg.image}`;

            return (
              <div
                key={pkg._id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.08)] overflow-hidden transition-all duration-300 flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={imageSrc}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={pkg.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#0D231E] shadow-sm">
                      ৳{pkg.price?.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#0D231E] group-hover:text-[#2cb775] transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {pkg.shortDescription || pkg.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-[#2cb775]" />
                      <span className="capitalize">{pkg.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:clock" className="w-3.5 h-3.5 text-gray-400" />
                      <span>{pkg.duration}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/tour-packages/edit/${pkg._id}`}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-[#2cb775]/10 hover:text-[#2cb775] transition-colors"
                      title="Edit package"
                    >
                      <Icon icon="lucide:pencil" className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete package"
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
      {pagination.totalPages > 1 && !searchQuery && (
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
    </div>
  );
}
