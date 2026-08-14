"use client";
import Button from "@/components/Button";
import { testimonialYupSchema } from "@/yup/testimonialYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="cursor-pointer focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Icon
            icon={active >= star ? "solar:star-bold" : "codicon:star-empty"}
            width="28"
            height="28"
            className={active >= star ? "text-yellow-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialForm({ testimonial }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: testimonial?.name || "",
      country: testimonial?.country || "",
      feedback: testimonial?.feedback || "",
      rating: testimonial?.rating || 0,
      backgroundImage: [],
      avatarImage: [],
    },
    resolver: yupResolver(testimonialYupSchema(isEdit)),
  });

  const feedbackValue = watch("feedback") || "";
  const ratingValue = watch("rating");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("country", data.country);
    formData.append("feedback", data.feedback);
    formData.append("rating", data.rating);
    if (data.backgroundImage && data.backgroundImage[0]) {
      formData.append("backgroundImage", data.backgroundImage[0]);
    }
    if (data.avatarImage && data.avatarImage[0]) {
      formData.append("avatarImage", data.avatarImage[0]);
    }

    setLoading(true);

    if (isEdit) {
      formData.append("existingBackgroundImage", testimonial.backgroundImage);
      formData.append("existingAvatarImage", testimonial.avatarImage);

      try {
        const res = await fetch(`/api/testimonial/${testimonial._id}`, {
          method: "PUT",
          body: formData,
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Testimonial updated successfully!");
          setLoading(false);
          router.push("/dashboard/testimonials");
        } else {
          toast.error(result.error || "Update failed");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/testimonial", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (res.ok) {
          reset();
          setValue("rating", 0);
          toast.success("Testimonial created successfully!");
          setLoading(false);
        } else {
          toast.error(result.error || "Creation failed");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="md:w-4/5 mx-auto">
      <div className="mt-10">
        <div className="flex justify-between items-center gap-4 mt-8">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Update" : "Create new"} testimonial
          </h1>
          <Link
            className="bg-orange text-white px-4 py-2 rounded-xl text-nowrap"
            href="/dashboard/testimonials"
          >
            See testimonials
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-y-6 mt-8"
          action="#"
        >
          {/* Name */}
          <div>
            <label className="mb-1 block font-medium">Client Name:</label>
            <input
              type="text"
              className="border border-gray-500 p-4 rounded-md w-full block"
              placeholder="e.g. John Smith"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 ml-1 mt-1 text-sm capitalize">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="mb-1 block font-medium">Country:</label>
            <input
              type="text"
              className="border border-gray-500 p-4 rounded-md w-full block"
              placeholder="e.g. Bangladesh"
              {...register("country")}
            />
            {errors.country && (
              <p className="text-red-500 ml-1 mt-1 text-sm capitalize">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Feedback with char counter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium">Client Review:</label>
              <span
                className={`text-sm ${feedbackValue.length > 350 ? "text-red-500" : "text-gray-500"}`}
              >
                {feedbackValue.length}/350
              </span>
            </div>
            <textarea
              rows={4}
              className="border border-gray-500 p-4 rounded-md w-full block resize-none"
              placeholder="Share the client's experience..."
              {...register("feedback")}
            />
            {errors.feedback && (
              <p className="text-red-500 ml-1 mt-1 text-sm">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* Star Rating */}
          <div>
            <label className="mb-2 block font-medium">Rating:</label>
            <StarPicker
              value={ratingValue}
              onChange={(val) => setValue("rating", val, { shouldValidate: true })}
            />
            {errors.rating && (
              <p className="text-red-500 ml-1 mt-1 text-sm">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Background Image */}
          <div>
            <label className="mb-1 block font-medium">
              Background / Destination Image:
              {isEdit && (
                <span className="text-gray-400 font-normal text-sm ml-2">
                  (leave empty to keep current)
                </span>
              )}
            </label>
            {isEdit && testimonial?.backgroundImage && (
              <div className="mb-3">
                <Image
                  src={`/api/uploads/testimonials/${testimonial.backgroundImage}`}
                  width={300}
                  height={160}
                  alt="Current background"
                  className="rounded-md object-cover h-40 w-auto"
                />
                <p className="text-xs text-gray-500 mt-1">Current background image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="border border-gray-500 p-4 rounded-md w-full block"
              {...register("backgroundImage")}
            />
            {errors.backgroundImage && (
              <p className="text-red-500 ml-1 mt-1 text-sm">
                {errors.backgroundImage.message}
              </p>
            )}
          </div>

          {/* Avatar Image */}
          <div>
            <label className="mb-1 block font-medium">
              Client Avatar / Photo:
              {isEdit && (
                <span className="text-gray-400 font-normal text-sm ml-2">
                  (leave empty to keep current)
                </span>
              )}
            </label>
            {isEdit && testimonial?.avatarImage && (
              <div className="mb-3">
                <Image
                  src={`/api/uploads/testimonials/${testimonial.avatarImage}`}
                  width={100}
                  height={100}
                  alt="Current avatar"
                  className="rounded-full object-cover size-24"
                />
                <p className="text-xs text-gray-500 mt-1">Current avatar</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="border border-gray-500 p-4 rounded-md w-full block"
              {...register("avatarImage")}
            />
            {errors.avatarImage && (
              <p className="text-red-500 ml-1 mt-1 text-sm">
                {errors.avatarImage.message}
              </p>
            )}
          </div>

          {isEdit ? (
            <Button
              name={loading ? "Updating..." : "Update"}
              className="bg-blue-600! text-white rounded-lg w-fit ml-auto"
            />
          ) : (
            <Button
              name={loading ? "Publishing..." : "Publish"}
              className="bg-green! text-white rounded-lg w-fit ml-auto"
            />
          )}
        </form>
      </div>
    </div>
  );
}
