"use client";

import MediaGalleryModal from "@/components/dashboard/media/MediaGalleryModal";
import { getImageUrl } from "@/lib/imageUrl";
import { locationYupSchema } from "@/yup/locationYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function TourLocationForm({ location }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const [imagePath, setImagePath] = useState(location?.image || "");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: location?.country || "",
      description: location?.description || "",
    },
    resolver: yupResolver(locationYupSchema(isEdit)),
  });

  useEffect(() => {
    if (location) {
      reset({
        country: location.country || "",
        description: location.description || "",
      });
      setImagePath(location.image || "");
    }
  }, [location, reset]);

  const handleSelectMedia = (selected) => {
    const url = Array.isArray(selected) ? selected[0] : selected;
    if (url) {
      setImagePath(url);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        country: data.country.trim(),
        description: data.description ? data.description.trim() : "",
        image: imagePath || null,
      };

      const locId = location?.id;
      const url = isEdit ? `/api/tour-location/${locId}` : "/api/tour-location";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || resData.message || "Failed to save location");
      }

      toast.success(isEdit ? "Tour location updated successfully!" : "Tour location created successfully!");
      router.push("/dashboard/tour-locations");
      router.refresh();
    } catch (error) {
      console.error("Location Submit Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    console.error("Location Form Validation Error:", errors);
    const firstErr = Object.values(errors)[0];
    if (firstErr) {
      toast.error(firstErr.message || "Please fill in all required fields");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter">
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D231E]">
            {isEdit ? "Update Destination Location" : "Create New Destination Location"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage tour countries, banner images, and regional descriptions.
          </p>
        </div>
        <Link
          href="/dashboard/tour-locations"
          className="px-4 py-2.5 rounded-xl bg-sand hover:bg-emerald-50 text-[#0D231E] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-emerald-200/60"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4 text-emerald-600" />
          <span>Back to Locations</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country / Location Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Thailand, Nepal, Maldives"
              {...register("country")}
              className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
            />
            {errors.country && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Brief description of this travel destination..."
              {...register("description")}
              className="w-full bg-sand border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Destination Banner Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-sand border border-gray-200 shrink-0">
                {imagePath ? (
                  <Image
                    src={getImageUrl(imagePath)}
                    alt="Destination image"
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
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Icon icon="lucide:folder-open" className="w-4 h-4" />
                  <span>Choose from Media Gallery</span>
                </button>
                {imagePath && (
                  <button
                    type="button"
                    onClick={() => setImagePath("")}
                    className="text-xs text-rose-600 hover:underline font-semibold block"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/tour-locations"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Icon icon="lucide:check" className="w-4 h-4" />
            <span>{loading ? "Saving..." : isEdit ? "Update Location" : "Create Location"}</span>
          </button>
        </div>
      </form>

      <MediaGalleryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={handleSelectMedia}
        multiple={false}
        initialSelected={imagePath}
        title="Select Location Banner Image"
      />
    </div>
  );
}
