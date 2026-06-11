"use client";
import Rating from "@/components/Rating";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TestimonialsPage({ testimonials, pagination }) {
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
    <div className="md:w-4/5 mx-auto">
      <div className="flex justify-between mt-8">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link
          className="bg-orange text-white px-4 py-2 rounded-xl"
          href="/dashboard/testimonials/create"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="mt-10">
        {testimonials.length === 0 && (
          <div className="w-fit mx-auto text-center">
            <Image
              src="/images/dashboard/empty.png"
              width={400}
              height={400}
              loading="eager"
              alt="empty"
            />
            <p className="text-gray-500 text-xl mt-8 font-inter">
              No testimonials yet!
            </p>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item._id} className="shadow-md p-4 rounded-md">
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={`/api/uploads/testimonials/${item.avatarImage}`}
                    width={52}
                    height={52}
                    alt={item.name}
                    className="rounded-full object-cover size-13 flex-shrink-0"
                  />
                  <div>
                    <h5 className="font-semibold capitalize">{item.name}</h5>
                    <p className="text-sm text-gray-500 capitalize">{item.country}</p>
                    <Rating
                      rating={item.rating}
                      className="size-4 text-green mt-0.5"
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-shrink-0">
                  <Link href={`/dashboard/testimonials/edit/${item._id}`}>
                    <button className="cursor-pointer hover:text-blue-500">
                      <Icon icon="fluent:edit-24-regular" width="20" height="20" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="cursor-pointer hover:text-red-500"
                  >
                    <Icon icon="mingcute:delete-2-line" width="20" height="20" />
                  </button>
                </div>
              </div>

              {/* Background image */}
              <Image
                src={`/api/uploads/testimonials/${item.backgroundImage}`}
                width={500}
                height={200}
                alt="destination"
                loading="eager"
                className="rounded-md object-cover w-full h-40"
              />

              {/* Feedback preview */}
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2 items-center">
        <Link
          href={
            isPrev
              ? "/dashboard/testimonials?page=1"
              : `/dashboard/testimonials?page=${Number(pagination.page) - 1}`
          }
          className={`px-3 py-1 border rounded-md ${isPrev ? "cursor-not-allowed opacity-50 border-gray-200" : "hover:bg-gray-200"}`}
        >
          Prev
        </Link>
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <Link
            key={i}
            href={`/dashboard/testimonials?page=${i + 1}`}
            className={`px-3 py-1 border rounded-md ${pagination.page.toString() === (i + 1).toString() ? "bg-orange border-orange text-white" : "hover:bg-gray-200"}`}
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
          className={`px-3 py-1 border rounded-md ${isNext ? "cursor-not-allowed opacity-50 border-gray-200" : "hover:bg-gray-200"}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
