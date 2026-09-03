"use client";

import MediaGalleryModal from "@/components/dashboard/media/MediaGalleryModal";
import { getImageUrl } from "@/lib/imageUrl";
import { testimonialYupSchema } from "@/yup/testimonialYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RATING_LABELS = {
  1: "1 Star - Poor",
  2: "2 Stars - Fair",
  3: "3 Stars - Good",
  4: "4 Stars - Very Good",
  5: "5 Stars - Exceptional",
};

function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="cursor-pointer transition-transform hover:scale-110 focus:outline-none p-0.5"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Icon
              icon={active >= star ? "solar:star-bold" : "solar:star-linear"}
              width="26"
              height="26"
              className={
                active >= star
                  ? "text-amber-400 drop-shadow-[0_1px_4px_rgba(251,191,36,0.4)]"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-600 bg-sand px-3 py-1 rounded-full border border-gray-200">
        {RATING_LABELS[active] || `${active} Stars`}
      </span>
    </div>
  );
}

export default function TestimonialForm({ testimonial }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  // Model fields: name, country, feedback, rating, backgroundImage, avatarImage, isPublished, sortOrder
  const [bgImage, setBgImage] = useState(testimonial?.backgroundImage || "");
  const [avatarImage, setAvatarImage] = useState(testimonial?.avatarImage || "");
  const [isPublished, setIsPublished] = useState(testimonial?.isPublished ?? true);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

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
      rating: testimonial?.rating || 5,
      sortOrder: testimonial?.sortOrder || 0,
    },
    resolver: yupResolver(testimonialYupSchema(isEdit)),
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        name: testimonial.name || "",
        country: testimonial.country || "",
        feedback: testimonial.feedback || "",
        rating: testimonial.rating || 5,
        sortOrder: testimonial.sortOrder || 0,
      });
      setBgImage(testimonial.backgroundImage || "");
      setAvatarImage(testimonial.avatarImage || "");
      setIsPublished(testimonial.isPublished ?? true);
    }
  }, [testimonial, reset]);

  const feedbackValue = watch("feedback") || "";
  const ratingValue = watch("rating") || 5;

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data.name.trim(),
      country: data.country.trim(),
      feedback: data.feedback.trim(),
      rating: Number(data.rating) || 5,
      backgroundImage: bgImage || null,
      avatarImage: avatarImage || null,
      isPublished: Boolean(isPublished),
      sortOrder: Number(data.sortOrder) || 0,
    };

    if (isEdit) {
      try {
        const testId = testimonial?.id;
        const res = await fetch(`/api/testimonial/${testId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Testimonial updated successfully!");
          router.push("/dashboard/testimonials");
          router.refresh();
        } else {
          toast.error(result.error || result.message || "Update failed");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/testimonial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Testimonial published successfully!");
          router.push("/dashboard/testimonials");
          router.refresh();
        } else {
          toast.error(result.error || result.message || "Creation failed");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const onError = (formErrors) => {
    const firstErr = Object.values(formErrors)[0];
    if (firstErr) {
      toast.error(firstErr.message || "Please fill in all required fields");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter pb-16">
      {/* Top Header Card */}
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D231E]">
            {isEdit ? "Update Testimonial" : "Create New Testimonial"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish authentic guest reviews, traveler impressions, and verified ratings.
          </p>
        </div>
        <Link
          href="/dashboard/testimonials"
          className="px-4 py-2.5 rounded-xl bg-sand hover:bg-emerald-50 text-[#0D231E] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-emerald-200/60 shrink-0"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4 text-emerald-600" />
          <span>Back to Testimonials</span>
        </Link>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-6"
      >
        {/* Name & Country (2-column row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Client Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              {...register("name")}
              className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country / Origin *
            </label>
            <input
              type="text"
              placeholder="e.g. United Kingdom"
              {...register("country")}
              className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
            />
            {errors.country && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.country.message}</p>
            )}
          </div>
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Trip Rating *
          </label>
          <StarRatingInput
            value={ratingValue}
            onChange={(val) => setValue("rating", val, { shouldValidate: true })}
          />
          {errors.rating && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.rating.message}</p>
          )}
        </div>

        {/* Feedback / Review Text */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Client Review & Feedback *
            </label>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                feedbackValue.length > 350
                  ? "bg-rose-100 text-rose-600"
                  : "bg-sand text-gray-500"
              }`}
            >
              {feedbackValue.length} / 350 characters
            </span>
          </div>
          <textarea
            rows={4}
            placeholder="Share the client's safari experience, tour highlights, and memorable moments..."
            {...register("feedback")}
            className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] resize-none leading-relaxed"
          />
          {errors.feedback && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.feedback.message}</p>
          )}
        </div>

        {/* Media Pickers (2-column clean card row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Destination Background Cover */}
          <div className="p-4 rounded-2xl bg-sand/40 border border-gray-200 space-y-3">
            <label className="block text-xs font-semibold text-gray-700">
              Destination Background Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-sand border border-gray-200 shrink-0">
                {bgImage ? (
                  <Image
                    src={getImageUrl(bgImage)}
                    alt="Destination cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Icon icon="lucide:image" className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setIsBgModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Icon icon="lucide:folder-open" className="w-3.5 h-3.5" />
                  <span>Choose Cover</span>
                </button>
                {bgImage && (
                  <button
                    type="button"
                    onClick={() => setBgImage("")}
                    className="text-xs text-rose-600 hover:underline font-semibold block"
                  >
                    Remove cover
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Client Avatar Portrait */}
          <div className="p-4 rounded-2xl bg-sand/40 border border-gray-200 space-y-3">
            <label className="block text-xs font-semibold text-gray-700">
              Client Avatar Portrait
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-sand border border-gray-200 shrink-0">
                {avatarImage ? (
                  <Image
                    src={getImageUrl(avatarImage)}
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Icon icon="lucide:user" className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
                  <span>Choose Avatar</span>
                </button>
                {avatarImage && (
                  <button
                    type="button"
                    onClick={() => setAvatarImage("")}
                    className="text-xs text-rose-600 hover:underline font-semibold block"
                  >
                    Remove avatar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visibility & Sort Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 items-center">
          {/* Published toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-sand/40 border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-[#0D231E]">
                Publish on Website
              </label>
              <span className="text-[11px] text-gray-500">
                {isPublished ? "Visible to website visitors" : "Saved as draft"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isPublished ? "bg-emerald-600" : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={isPublished}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isPublished ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Sort Order (Optional)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              {...register("sortOrder")}
              className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/testimonials"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#0D231E] hover:bg-[#2cb775] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon icon={isEdit ? "lucide:save" : "lucide:plus"} className="w-4 h-4" />
                <span>{isEdit ? "Update Testimonial" : "Publish Testimonial"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/*
      ========================================================================
      REAL-TIME CARD PREVIEW (COMMENTED OUT AS REQUESTED)
      ========================================================================
      <div className="lg:col-span-5 sticky top-8 space-y-4">
        ...
      </div>
      ========================================================================
      */}

      {/* Media Selection Modals */}
      <MediaGalleryModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        onSelectImage={(url) => {
          setBgImage(url);
          setIsBgModalOpen(false);
        }}
        title="Select Destination Cover Image"
        initialSelected={bgImage}
      />
      <MediaGalleryModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelectImage={(url) => {
          setAvatarImage(url);
          setIsAvatarModalOpen(false);
        }}
        title="Select Client Avatar Photo"
        initialSelected={avatarImage}
      />
    </div>
  );
}
