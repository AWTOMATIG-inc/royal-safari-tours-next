"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function GalleryPage({ images }) {
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
    <div className="md:w-4/5 mx-auto">
      <div className="flex justify-between mt-8 items-center">
        <h1 className="text-2xl font-bold">Gallery</h1>
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
            className="bg-orange text-white px-4 py-2 rounded-xl cursor-pointer disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      <div className="mt-10">
        {images.length === 0 && (
          <div className="w-fit mx-auto text-center">
            <Image
              src="/images/dashboard/empty.png"
              width={400}
              height={400}
              loading="eager"
              alt="empty"
            />
            <p className="text-gray-500 text-xl mt-8 font-inter">
              No gallery images yet!
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div key={item._id} className="relative group rounded-md overflow-hidden shadow-md">
              <Image
                src={`/api/uploads/gallery/${item.filename}`}
                width={400}
                height={300}
                alt="gallery"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Icon icon="mingcute:delete-2-line" width="18" height="18" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
