"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientGalleryPage({ items = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    destination: "",
    packageId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Extract unique destinations
  const destinations = [
    "All",
    ...Array.from(new Set(items.map((item) => item.destination).filter(Boolean))),
  ];

  // Helper to construct full image URL
  const getFullImageUrl = (pathStr) => {
    if (!pathStr) return "/images/placeholder.jpg";
    if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
      return pathStr;
    }
    if (pathStr.startsWith("/uploads/")) {
      return `${API_BASE}${pathStr}`;
    }
    if (pathStr.startsWith("/api/uploads/")) {
      return pathStr;
    }
    return `/api/uploads/gallery/${pathStr}`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      caption: "",
      destination: "",
      packageId: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setSelectedItem(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Create Client Gallery Item
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image to upload!");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("image", selectedFile);
      data.append("title", formData.title);
      data.append("caption", formData.caption);
      data.append("destination", formData.destination);
      data.append("packageId", formData.packageId);

      const res = await fetch("/api/client-gallery", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      toast.success("Client photo uploaded successfully!");
      setIsAddModalOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Edit Client Gallery Item
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || "",
      caption: item.caption || "",
      destination: item.destination || "",
      packageId: item.packageId || "",
    });
    setPreviewUrl(getFullImageUrl(item.imageUrl));
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!formData.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      if (selectedFile) {
        data.append("image", selectedFile);
      }
      data.append("title", formData.title);
      data.append("caption", formData.caption);
      data.append("destination", formData.destination);
      data.append("packageId", formData.packageId);

      const res = await fetch(`/api/client-gallery/${selectedItem.id}`, {
        method: "PATCH",
        body: data,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Client photo updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  // Delete Client Gallery Item
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this client photo?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/client-gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Client photo deleted!");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.title || "").toLowerCase().includes(q) ||
      (item.caption || "").toLowerCase().includes(q) ||
      (item.destination || "").toLowerCase().includes(q);

    const matchesDest =
      selectedDestination === "All" || item.destination === selectedDestination;

    return matchesSearch && matchesDest;
  });

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      {/* Page Header */}
      <DashboardPageHeader
        title="Clients Gallery"
        description="Showcase client & traveler photo stories, expedition highlights, and destination moments."
        actionText="Upload Client Photo"
        onAction={() => {
          resetForm();
          setIsAddModalOpen(true);
        }}
      />

      {/* Filter & Search Bar + Quick Upload Action */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4 font-inter">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Icon
            icon="lucide:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title or destination..."
            className="w-full bg-sand border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-inter text-primary focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {/* Destination Filter Tabs & Direct Upload Button */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Destination:</span>
          {destinations.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDestination(dest)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDestination === dest
                  ? "bg-[#0D231E] text-white"
                  : "bg-sand text-gray-600 hover:bg-gray-200"
              }`}
            >
              {dest}
            </button>
          ))}

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors duration-300 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Icon icon="lucide:upload" className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-3 font-inter">
          <div className="w-16 h-16 rounded-full bg-sand text-gray-400 flex items-center justify-center mx-auto">
            <Icon icon="lucide:camera-off" className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#0D231E]">No Client Photos Uploaded</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Upload new client images to showcase them in the public website gallery.
          </p>
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <Icon icon="lucide:upload" className="w-4 h-4" />
            <span>Upload First Client Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full bg-sand overflow-hidden">
                <Image
                  src={getFullImageUrl(item.imageUrl)}
                  alt={item.title || "Client photo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Destination Badge */}
                {item.destination && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="bg-[#0D231E]/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-medium tracking-wide">
                      📍 {item.destination}
                    </span>
                  </div>
                )}
              </div>

              {/* Info Block */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-inter">
                <div>
                  <h4 className="text-sm font-bold text-[#0D231E] line-clamp-1 group-hover:text-[#2cb775] transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-light">
                      "{item.caption}"
                    </p>
                  )}
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                    title="Edit Photo"
                  >
                    <Icon icon="lucide:pencil" className="w-4 h-4" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Photo"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD / ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-gray-100 font-inter relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0D231E]">Upload Client Photo</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 font-inter">
              {/* File Upload Dropzone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Image File *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-sand/50"
                >
                  {previewUrl ? (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <Icon icon="lucide:upload-cloud" className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-xs font-medium text-gray-600">Click to choose image file</p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajek Valley Sunrise Memories"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Destination Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Sajek Valley, Cox's Bazar, Nepal"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Caption / Client Quote</label>
                <textarea
                  rows="3"
                  placeholder="Enter caption or traveler story..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl p-3 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0D231E] hover:bg-[#2cb775] text-white transition-colors cursor-pointer"
                >
                  {loading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-gray-100 font-inter relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0D231E]">Edit Client Photo</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 font-inter">
              {/* Image Preview / Replacement */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Image (Click to replace)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-3 text-center cursor-pointer transition-colors bg-sand/50"
                >
                  {previewUrl && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 mt-2">Click to select replacement image</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Destination Tag</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Caption / Client Quote</label>
                <textarea
                  rows="3"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full mt-1 bg-sand border border-gray-200 rounded-xl p-3 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0D231E] hover:bg-[#2cb775] text-white transition-colors cursor-pointer"
                >
                  {loading ? "Saving..." : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
