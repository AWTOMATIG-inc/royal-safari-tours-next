"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import MediaGalleryModal from "@/components/dashboard/media/MediaGalleryModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 12;

export default function ClientGalleryPage({ items = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination on filter / search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDestination]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
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
    if (!selectedFile && !previewUrl) {
      toast.error("Please select an image to upload!");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (selectedFile) {
        const data = new FormData();
        data.append("image", selectedFile);
        data.append("title", formData.title);
        data.append("caption", formData.caption || "");
        data.append("destination", formData.destination || "");
        data.append("packageId", formData.packageId || "");

        res = await fetch("/api/client-gallery", {
          method: "POST",
          body: data,
        });
      } else {
        res = await fetch("/api/client-gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: previewUrl,
            title: formData.title,
            caption: formData.caption || "",
            destination: formData.destination || "",
            packageId: formData.packageId || "",
          }),
        });
      }

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
    setSelectedFile(null);
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
      const itemId = selectedItem?.id;
      let res;

      if (selectedFile) {
        const data = new FormData();
        data.append("image", selectedFile);
        data.append("title", formData.title);
        data.append("caption", formData.caption || "");
        data.append("destination", formData.destination || "");
        data.append("packageId", formData.packageId || "");

        res = await fetch(`/api/client-gallery/${itemId}`, {
          method: "PATCH",
          body: data,
        });
      } else {
        res = await fetch(`/api/client-gallery/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: previewUrl,
            title: formData.title,
            caption: formData.caption || "",
            destination: formData.destination || "",
            packageId: formData.packageId || "",
          }),
        });
      }

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

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/client-gallery/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Client photo deleted!");
      setDeleteModal({ open: false, id: null, title: "" });
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
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
  }, [items, searchQuery, selectedDestination]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      {/* Page Header with working action handler */}
      <DashboardPageHeader
        title="Clients Gallery"
        description="Showcase client & traveler photo stories, expedition highlights, and destination moments."
        actionText="Upload Client Photo"
        actionIcon="lucide:plus"
        onActionClick={() => {
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
            placeholder="Search titles, captions, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sand border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary font-inter focus:outline-none focus:border-secondary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Destination Tabs */}
        {destinations.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl scrollbar-none font-inter">
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedDestination === dest
                    ? "bg-[#0D231E] text-white shadow-xs"
                    : "bg-sand text-gray-600 hover:bg-gray-200"
                }`}
              >
                {dest === "All" ? "All Destinations" : dest}
              </button>
            ))}
          </div>
        )}
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
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#0D231E] hover:bg-secondary text-white text-xs font-semibold transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Icon icon="lucide:upload" className="w-4 h-4" />
            <span>Upload First Client Photo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6 font-inter">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full bg-sand overflow-hidden">
                  <Image
                    src={getFullImageUrl(item.imageUrl)}
                    alt={item.title || "Client Photo"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Destination Tag */}
                  {item.destination && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white tracking-wide uppercase border border-white/10">
                        {item.destination}
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 rounded-xl bg-white text-primary hover:bg-secondary hover:text-white transition-colors cursor-pointer shadow-sm"
                      title="Edit photo details"
                    >
                      <Icon icon="lucide:edit-3" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item.id, item.title)}
                      className="p-2 rounded-xl bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shadow-sm"
                      title="Delete photo"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-primary truncate leading-snug">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-light leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {/* Date & Package info */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {item.package && (
                      <span className="text-secondary font-medium truncate max-w-[120px]">
                        {item.package.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 font-inter">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-primary">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}
                </span>{" "}
                of <span className="font-semibold text-primary">{filteredItems.length}</span>{" "}
                client photos
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      currentPage === pageNum
                        ? "bg-[#0D231E] text-white border-[#0D231E] shadow-xs"
                        : "bg-white border-gray-200 text-gray-600 hover:border-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
              {/* Image Selection: Drag/Drop or Media Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Photo Asset *</label>
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="lucide:folder-open" className="w-3.5 h-3.5" />
                    <span>Choose from Media Gallery</span>
                  </button>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-sand/50 group"
                >
                  {previewUrl ? (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-inner">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="py-5 space-y-2">
                      <Icon icon="lucide:upload-cloud" className="w-9 h-9 text-gray-400 mx-auto group-hover:text-secondary transition-colors" />
                      <p className="text-xs font-semibold text-gray-700">Click to upload from device</p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 10MB or choose from library</p>
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
                <label className="text-xs font-semibold text-gray-700">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajek Valley Sunrise Memories"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
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
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
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
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl p-3 text-xs text-primary focus:outline-none focus:border-secondary resize-none"
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D231E] hover:bg-secondary text-white transition-all duration-300 cursor-pointer shadow-xs disabled:opacity-50"
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Image Asset</label>
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="lucide:folder-open" className="w-3.5 h-3.5" />
                    <span>Choose from Media Gallery</span>
                  </button>
                </div>

                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-3 text-center cursor-pointer transition-colors bg-sand/50 group"
                >
                  {previewUrl && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-inner">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        Click to replace photo
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 mt-2">Click to select replacement image from device</p>
                </div>
                <input
                  type="file"
                  ref={editFileInputRef}
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
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Destination Tag</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Caption / Client Quote</label>
                <textarea
                  rows="3"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full mt-1 bg-sand/50 border border-gray-200 rounded-xl p-3 text-xs text-primary focus:outline-none focus:border-secondary resize-none"
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D231E] hover:bg-secondary text-white transition-all duration-300 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Gallery Selector Modal */}
      <MediaGalleryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={(url) => {
          setPreviewUrl(url);
          setSelectedFile(null); // using URL from media gallery
          setIsMediaModalOpen(false);
        }}
        title="Select Client Gallery Photo"
        initialSelected={previewUrl}
      />

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Client Photo"
        message={`Are you sure you want to delete ${deleteModal.title ? `"${deleteModal.title}"` : "this photo"}? This action cannot be undone.`}
        confirmText="Delete Photo"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
