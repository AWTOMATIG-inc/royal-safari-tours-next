"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TourCardPage({ tourPackages = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
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

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Tour Packages"
        description="Create, edit, and manage all luxury travel itineraries and price options."
        actionText="Create New Package"
        actionHref="/dashboard/tour-packages/create"
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
            No tour packages found. Click above to create your first package.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tourPackages.map((pkg) => {
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
                    <h3 className="font-bold text-lg text-[#0D231E] font-inter group-hover:text-[#2cb775] transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-inter line-clamp-2 mt-1">
                      {pkg.shortDescription || pkg.description || "Luxury expedition package."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/packages/${pkg.slug}`}
                    target="_blank"
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#2cb775] transition-colors flex items-center gap-1 font-inter"
                  >
                    <span>Preview</span>
                    <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/tour-packages/edit/${pkg.slug}`}
                      className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Edit package"
                    >
                      <Icon icon="lucide:pencil" className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
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
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <Link
            href={
              isPrev
                ? "/dashboard/tour-packages?page=1"
                : `/dashboard/tour-packages?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/tour-packages?page=${i + 1}`}
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
                ? `/dashboard/tour-packages?page=${pagination.totalPages}`
                : `/dashboard/tour-packages?page=${Number(pagination.page) + 1}`
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
