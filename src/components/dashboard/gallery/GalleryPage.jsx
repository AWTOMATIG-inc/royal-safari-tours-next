"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function GalleryPage({ images = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("/api/gallery", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        successCount++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? "s" : ""} uploaded!`);
      router.refresh();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted!");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-inter">
            Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light font-inter">
            Manage high-resolution wilderness photography and travel asset media.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#DE8D3D] text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all duration-300 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Icon icon="lucide:upload-cloud" className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload New Images"}</span>
          </button>
        </div>
      </div>

      {images.length === 0 ? (
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
            No gallery images found. Upload photos to showcase your expeditions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((item) => {
            const imgSrc = item.filename?.startsWith("http") || item.filename?.startsWith("/")
              ? item.filename
              : `/api/uploads/gallery/${item.filename}`;

            return (
              <div
                key={item._id}
                className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_35px_rgba(13,35,30,0.1)] transition-all duration-300 aspect-square"
              >
                <Image
                  src={imgSrc}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  alt="Gallery photography"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                  <span className="text-[10px] text-white/80 font-mono truncate max-w-[70%]">
                    {item.filename}
                  </span>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                    title="Delete image"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
