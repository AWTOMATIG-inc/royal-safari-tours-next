"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import Rating from "@/components/Rating";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TestimonialsPage({ testimonials = [], pagination = { page: 1, totalPages: 1 } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const isPrev = Number(pagination.page || 1) === 1;
  const isNext = Number(pagination.page || 1) === Number(pagination.totalPages || 1);

  const handleOpenDeleteModal = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/testimonial/${deleteModal.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Testimonial deleted successfully!");
      setDeleteModal({ open: false, id: null, name: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (item.name || "").toLowerCase();
    const country = (item.country || "").toLowerCase();
    const feedback = (item.feedback || item.reviewText || "").toLowerCase();
    return name.includes(q) || country.includes(q) || feedback.includes(q);
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Testimonials"
        description="Publish and manage customer reviews, ratings, and traveler spotlight quotes."
        actionText="Add Testimonial"
        actionHref="/dashboard/testimonials/create"
        actionIcon="lucide:quote"
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
            placeholder="Search testimonials..."
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
            Found <span className="font-bold text-[#0D231E]">{filteredTestimonials.length}</span> matching testimonial(s)
          </div>
        )}
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4 font-inter">
          <Image
            src="/images/placeholders/empty_state.png"
            width={300}
            height={300}
            priority
            alt="Empty state"
            className="mx-auto opacity-80"
          />
          <p className="text-gray-500 font-medium text-base">
            No testimonials found. Click above to add your first review.
          </p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-4 font-inter">
          <Icon icon="lucide:search-x" className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium text-base">
            No testimonials match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-[#0D231E] text-white text-xs font-semibold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map((item, idx) => {
            const itemId = item.id || `testi-${idx}`;
            const avatarSrc = item.avatarImage?.startsWith("http") || item.avatarImage?.startsWith("/")
              ? item.avatarImage
              : `/api/uploads/testimonials/${item.avatarImage}`;

            const bgSrc = item.backgroundImage?.startsWith("http") || item.backgroundImage?.startsWith("/")
              ? item.backgroundImage
              : `/api/uploads/testimonials/${item.backgroundImage}`;

            return (
              <div
                key={itemId}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.08)] p-6 space-y-4 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                        <Image
                          src={avatarSrc}
                          alt={item.name || "Testimonial Author"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0D231E]">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.country}</p>
                      </div>
                    </div>

                    <Rating rating={item.rating} readOnly />
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic border-l-2 border-[#2cb775] pl-3">
                    &ldquo;{item.feedback || item.reviewText}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50" title="Background Banner">
                    <Image
                      src={bgSrc}
                      alt="Banner"
                      fill
                      sizes="64px"
                      className="object-cover opacity-80"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/testimonials/edit/${itemId}`}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-[#2cb775]/10 hover:text-[#2cb775] transition-colors"
                      title="Edit testimonial"
                    >
                      <Icon icon="lucide:pencil" className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleOpenDeleteModal(itemId, item.name)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete testimonial"
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
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={
              isPrev
                ? "/dashboard/testimonials?page=1"
                : `/dashboard/testimonials?page=${Number(pagination.page) - 1}`
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
              href={`/dashboard/testimonials?page=${i + 1}`}
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
                ? `/dashboard/testimonials?page=${pagination.totalPages}`
                : `/dashboard/testimonials?page=${Number(pagination.page) + 1}`
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
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete ${deleteModal.name ? `"${deleteModal.name}"'s testimonial` : "this testimonial"}? This action cannot be undone.`}
        confirmText="Delete Testimonial"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
