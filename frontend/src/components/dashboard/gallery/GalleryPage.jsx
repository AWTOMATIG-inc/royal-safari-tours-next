"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function GalleryPage({ images = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenDeleteModal = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteModal.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted successfully!");
      setDeleteModal({ open: false, id: null });
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-inter">
            Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-inter">
            Upload and manage photos for the gallery section.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Icon icon="lucide:upload" className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Icon icon="lucide:image" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium font-inter">No gallery images uploaded yet.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 rounded-xl bg-[#0D231E] text-white text-xs font-semibold hover:bg-[#2cb775] transition-colors"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => {
            const imgId = img.id;
            return (
              <div
                key={imgId}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-sand border border-gray-100 shadow-xs"
              >
                <Image
                  src={`/api/uploads/gallery/${img.filename}`}
                  alt="Gallery Photo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleOpenDeleteModal(imgId)}
                    className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg cursor-pointer"
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

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Gallery Photo"
        message="Are you sure you want to delete this photo from the gallery? This action cannot be undone."
        confirmText="Delete Photo"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
