"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import Rating from "@/components/Rating";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TestimonialsPage({ testimonials = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this testimonial?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/testimonial/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Testimonial deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Testimonials"
        description="Publish and manage customer reviews, ratings, and traveler spotlight quotes."
        actionText="Add Testimonial"
        actionHref="/dashboard/testimonials/create"
        actionIcon="lucide:quote"
      />

      {testimonials.length === 0 ? (
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
            No testimonials yet. Click above to add your first customer review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((item) => {
            const avatarSrc = item.avatarImage?.startsWith("http") || item.avatarImage?.startsWith("/")
              ? item.avatarImage
              : `/api/uploads/testimonials/${item.avatarImage}`;

            const bgSrc = item.backgroundImage?.startsWith("http") || item.backgroundImage?.startsWith("/")
              ? item.backgroundImage
              : `/api/uploads/testimonials/${item.backgroundImage}`;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.08)] p-6 space-y-4 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={avatarSrc}
                          fill
                          sizes="48px"
                          alt={item.name}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#0D231E] font-inter">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-inter font-medium">
                          {item.country}
                        </p>
                        <div className="flex items-center gap-1 text-[#DE8D3D] mt-0.5">
                          <Rating rating={item.rating || 5} className="size-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/testimonials/edit/${item._id}`}
                        className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit testimonial"
                      >
                        <Icon icon="lucide:pencil" className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete testimonial"
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-inter italic leading-relaxed line-clamp-3">
                    &ldquo;{item.feedback}&rdquo;
                  </p>
                </div>

                {bgSrc && (
                  <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl bg-gray-50 mt-2">
                    <Image
                      src={bgSrc}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      alt="Review background"
                      className="object-cover opacity-90"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={
              isPrev
                ? "/dashboard/testimonials?page=1"
                : `/dashboard/testimonials?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/testimonials?page=${i + 1}`}
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
                ? `/dashboard/testimonials?page=${pagination.totalPages}`
                : `/dashboard/testimonials?page=${Number(pagination.page) + 1}`
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
