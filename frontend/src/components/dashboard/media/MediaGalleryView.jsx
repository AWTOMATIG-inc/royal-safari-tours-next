"use client";

import { createMediaFolder, deleteMediaItem, getMediaByFolderPath } from "@/actions/media";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function MediaGalleryView({
  isModal = false,
  onSelectImage,
  multiple = false,
  onCloseModal,
  initialSelected = null,
  selectedUrls = [],
  setSelectedUrls,
}) {
  const fileInputRef = useRef(null);

  // Directory state
  const [currentPath, setCurrentPath] = useState(""); // "" = Root, "Tours", "Tours/Coral Island"
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // New folder creation state
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Load items whenever currentPath changes
  const loadMedia = async () => {
    setLoading(true);
    const res = await getMediaByFolderPath(currentPath);
    if (res.success) {
      setMediaItems(res.data);
    } else {
      toast.error("Failed to load media items");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, [currentPath]);

  // Breadcrumb path segments
  const pathSegments = currentPath ? currentPath.split("/") : [];

  const navigateToSegment = (index) => {
    if (index === -1) {
      setCurrentPath("");
    } else {
      const newPath = pathSegments.slice(0, index + 1).join("/");
      setCurrentPath(newPath);
    }
  };

  // Open nested folder
  const handleOpenFolder = (folderName) => {
    const nextPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(nextPath);
  };

  // Create folder inside currentPath
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;

    const res = await createMediaFolder(name, currentPath);
    if (res.success) {
      toast.success(`Folder "${name}" created!`);
      setNewFolderName("");
      setIsCreatingFolder(false);
      loadMedia();
    } else {
      toast.error(res.message || "Failed to create folder");
    }
  };

  // Upload image file(s) into currentPath
  const handleUploadFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("folderPath", currentPath);
      files.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success(`${files.length} image(s) uploaded!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadMedia();
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Delete folder or file
  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    const confirmed = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmed) return;

    const res = await deleteMediaItem(id);
    if (res.success) {
      toast.success("Item deleted");
      loadMedia();
    } else {
      toast.error(res.message);
    }
  };

  // Selection toggle (for form picker)
  const toggleSelect = (url) => {
    if (!isModal || !setSelectedUrls) return;

    if (!multiple) {
      // Single selection mode: Replace existing selection with the clicked URL
      setSelectedUrls([url]);
      return;
    }

    // Multiple selection mode: Toggle selection
    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter((u) => u !== url));
    } else {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  // Filter items by search query
  const filteredItems = mediaItems.filter((item) => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  return (
    <div className="space-y-6 font-inter">
      {/* Top Controls & Breadcrumbs Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(13,35,30,0.03)] space-y-4 font-inter">
        {/* Breadcrumb Path Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-gray-100 font-inter">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary overflow-x-auto py-1 font-inter">
            <button
              onClick={() => navigateToSegment(-1)}
              className={`flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer ${
                !currentPath ? "text-secondary font-bold" : "text-gray-600"
              }`}
            >
              <Icon icon="lucide:home" className="w-4 h-4" />
              <span>Root</span>
            </button>

            {pathSegments.map((segment, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-gray-400">
                <span>/</span>
                <button
                  onClick={() => navigateToSegment(idx)}
                  className={`hover:text-secondary transition-colors cursor-pointer ${
                    idx === pathSegments.length - 1 ? "text-secondary font-bold" : "text-gray-600"
                  }`}
                >
                  {segment}
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 font-inter">
            <button
              type="button"
              onClick={() => setIsCreatingFolder(!isCreatingFolder)}
              className="px-3.5 py-2 rounded-xl bg-sand hover:bg-gray-200 text-[#0D231E] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="lucide:folder-plus" className="w-4 h-4 text-secondary" />
              <span>+ New Folder</span>
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="lucide:upload-cloud" className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload Image(s)"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadFiles}
              className="hidden"
            />
          </div>
        </div>

        {/* Inline Create Folder Input Form */}
        {isCreatingFolder && (
          <form onSubmit={handleCreateFolder} className="flex items-center gap-2 bg-sand p-3 rounded-xl border border-gray-200 animate-in fade-in">
            <Icon icon="lucide:folder" className="w-4 h-4 text-secondary ml-1" />
            <input
              type="text"
              autoFocus
              placeholder={`Create folder inside ${currentPath ? `"${currentPath}"` : "Root"}...`}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-secondary"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0D231E] hover:bg-[#2cb775] text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Search Input Bar */}
        <div className="relative max-w-sm font-inter">
          <Icon icon="lucide:search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files or folders..."
            className="w-full bg-sand border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-inter text-primary focus:outline-none focus:border-secondary"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-inter">
          <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin mx-auto mb-2 text-secondary" />
          <p className="text-xs">Loading media directory...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs space-y-3 font-inter">
          <div className="w-14 h-14 rounded-full bg-sand text-gray-400 flex items-center justify-center mx-auto">
            <Icon icon="lucide:folder-open" className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-[#0D231E]">Directory Empty</h4>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Upload images or create nested folders inside {currentPath ? `"${currentPath}"` : "Root"}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 font-inter">
          {filteredItems.map((item) => {
            const isFolder = item.type === "folder";
            const isSelected = selectedUrls.includes(item.url);

            if (isFolder) {
              return (
                <div
                  key={item._id}
                  onClick={() => handleOpenFolder(item.name)}
                  className="group relative bg-white border border-gray-200 hover:border-secondary rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col items-center text-center space-y-2 font-inter"
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item._id, item.name)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Folder"
                  >
                    <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon="lucide:folder" className="w-6 h-6 fill-amber-500/20" />
                  </div>

                  <span className="text-xs font-bold text-[#0D231E] group-hover:text-secondary transition-colors line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-400">Folder</span>
                </div>
              );
            }

            return (
              <div
                key={item._id}
                onClick={() => toggleSelect(item.url)}
                className={`group relative aspect-square rounded-2xl overflow-hidden bg-sand border-2 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? "border-emerald-500 ring-4 ring-emerald-500/30 scale-98"
                    : "border-gray-200 hover:border-secondary"
                }`}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Clean Tick Mark Badge Overlay */}
                {isModal && isSelected && (
                  <div className="absolute top-2 left-2 z-30 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <Icon icon="lucide:check" className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Delete Button Overlay */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item._id, item.name)}
                  className="absolute top-2 right-2 z-20 p-2 bg-rose-600/90 text-white rounded-xl hover:bg-rose-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="Delete Image"
                >
                  <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                </button>

                {/* File Title Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[10px] truncate font-medium z-10">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
