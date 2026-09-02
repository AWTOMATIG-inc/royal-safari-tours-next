"use client";

import { createMediaFolder, deleteMediaItem, getMediaByFolderPath, renameMediaItem } from "@/actions/media";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { getImageUrl } from "@/lib/imageUrl";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "—";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
  const [currentPath, setCurrentPath] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" by default

  // Active menu dropdown ID
  const [activeMenuId, setActiveMenuId] = useState(null);

  // New folder creation state
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Rename modal state
  const [renameModal, setRenameModal] = useState({ open: false, id: null, name: "", isFolder: true });
  const [isRenaming, setIsRenaming] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview modal state for image
  const [previewImage, setPreviewImage] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (e.target.closest && e.target.closest(".menu-container")) return;
      setActiveMenuId(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  // Reset page when currentPath or searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentPath, searchQuery]);

  // Load items whenever currentPath changes
  const loadMedia = async () => {
    setLoading(true);
    const res = await getMediaByFolderPath(currentPath);
    if (res.success) {
      setMediaItems(res.data || []);
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

  const handleOpenFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    const res = await createMediaFolder(newFolderName.trim(), currentPath);
    if (res.success) {
      toast.success(`Folder "${newFolderName}" created!`);
      setNewFolderName("");
      setIsCreatingFolder(false);
      loadMedia();
    } else {
      toast.error(res.message);
    }
  };

  const handleOpenRenameModal = (e, id, name, isFolder = true) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveMenuId(null);
    setRenameModal({ open: true, id, name, isFolder });
  };

  const handleConfirmRename = async (e) => {
    e.preventDefault();
    if (!renameModal.id || !renameModal.name.trim()) return;
    setIsRenaming(true);
    try {
      const res = await renameMediaItem(renameModal.id, renameModal.name.trim());
      if (res.success) {
        toast.success("Renamed successfully!");
        setRenameModal({ open: false, id: null, name: "", isFolder: true });
        loadMedia();
      } else {
        toast.error(res.message || "Failed to rename item");
      }
    } catch (err) {
      toast.error(err.message || "Failed to rename item");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleUploadFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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

  const handleOpenDeleteModal = (e, id, name) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveMenuId(null);
    setDeleteModal({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await deleteMediaItem(deleteModal.id);
      if (res.success) {
        toast.success("Item deleted");
        setDeleteModal({ open: false, id: null, name: "" });
        loadMedia();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelect = (url) => {
    if (!isModal || !setSelectedUrls) return;

    if (!multiple) {
      setSelectedUrls([url]);
      return;
    }

    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter((u) => u !== url));
    } else {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return mediaItems;
    const q = searchQuery.toLowerCase().trim();
    return mediaItems.filter((item) =>
      (item.name || "").toLowerCase().includes(q)
    );
  }, [mediaItems, searchQuery]);

  // Separate folders and files
  const folders = useMemo(
    () => filteredItems.filter((i) => String(i.type || "").toUpperCase() === "FOLDER"),
    [filteredItems]
  );

  const files = useMemo(
    () => filteredItems.filter((i) => String(i.type || "").toUpperCase() !== "FOLDER"),
    [filteredItems]
  );

  // Pagination calculation for files
  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE) || 1;
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return files.slice(start, start + ITEMS_PER_PAGE);
  }, [files, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500 font-inter">
          <button
            type="button"
            onClick={() => navigateToSegment(-1)}
            className={`flex items-center gap-1.5 hover:text-[#2cb775] transition-colors font-semibold px-2.5 py-1.5 rounded-lg hover:bg-sand cursor-pointer ${
              pathSegments.length === 0 ? "text-[#0D231E] font-bold bg-sand" : ""
            }`}
          >
            <Icon icon="lucide:home" className="w-4 h-4 text-emerald-600" />
            <span>Root</span>
          </button>

          {pathSegments.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-gray-300">/</span>
              <button
                type="button"
                onClick={() => navigateToSegment(idx)}
                className={`px-2.5 py-1.5 rounded-lg hover:bg-sand hover:text-[#2cb775] transition-colors cursor-pointer ${
                  idx === pathSegments.length - 1
                    ? "text-[#0D231E] font-bold bg-sand"
                    : "text-gray-600 font-semibold"
                }`}
              >
                {segment}
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreatingFolder(true)}
            className="px-4 py-2.5 rounded-xl bg-sand hover:bg-emerald-50 text-[#0D231E] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-emerald-200/60 shadow-xs"
          >
            <Icon icon="lucide:folder-plus" className="w-4 h-4 text-emerald-600" />
            <span>+ New Folder</span>
          </button>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Icon icon="lucide:upload-cloud" className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload Image(s)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Folder Creator Input */}
      {isCreatingFolder && (
        <form
          onSubmit={handleCreateFolder}
          className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200 font-inter"
        >
          <Icon icon="lucide:folder" className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder Name (e.g., Sundarbans Tour)"
            autoFocus
            className="flex-1 bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Create Folder
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName("");
            }}
            className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Search Bar & View Mode Toggle (Grid by Default) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-[0_4px_20px_rgba(13,35,30,0.03)] flex items-center justify-between gap-4 font-inter">
        <div className="relative w-full max-w-md">
          <Icon
            icon="lucide:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files or folders..."
            className="w-full bg-sand border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-inter text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="lucide:x" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle (Grid by Default) */}
        <div className="flex items-center gap-1 bg-sand p-1 rounded-xl border border-gray-200/60">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-[#0D231E] shadow-xs font-bold"
                : "text-gray-500 hover:text-[#0D231E]"
            }`}
            title="List Table View"
          >
            <Icon icon="lucide:list" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-[#0D231E] shadow-xs font-bold"
                : "text-gray-500 hover:text-[#0D231E]"
            }`}
            title="Grid Cards View"
          >
            <Icon icon="lucide:layout-grid" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-inter">
          <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin mx-auto mb-2 text-[#2cb775]" />
          <p className="text-xs font-medium">Loading media directory...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs space-y-3 font-inter">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Icon icon="lucide:folder-open" className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-[#0D231E]">No items found</h4>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {searchQuery
              ? `No files or folders match "${searchQuery}".`
              : `Upload images or create nested folders inside ${currentPath ? `"${currentPath}"` : "Root"}.`}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-[#0D231E] text-white text-xs font-bold rounded-xl hover:bg-[#2cb775] transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === "list" ? (
        /* UNIFIED LIST / TABLE VIEW (FOR BOTH FOLDERS & FILES) */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden font-inter">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sand/60 text-gray-500 border-b border-gray-100 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Type / Owner</th>
                  <th className="py-3.5 px-4">Date Modified</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Render Folders First */}
                {folders.map((item) => {
                  const itemId = item.id;
                  const isMenuOpen = activeMenuId === itemId;

                  return (
                    <tr
                      key={itemId}
                      className="hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#0D231E]">
                        <div
                          onClick={() => handleOpenFolder(item.name)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                            <Icon icon="lucide:folder" className="w-5 h-5 fill-emerald-500/20" />
                          </div>
                          <span className="font-bold text-xs text-[#0D231E] group-hover:text-emerald-600 truncate max-w-[200px] sm:max-w-[300px]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                          Folder
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-gray-400 font-mono">—</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleOpenRenameModal(e, itemId, item.name, true)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Rename Folder"
                          >
                            <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Folder"
                          >
                            <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                          </button>

                          <div className="relative menu-container inline-block">
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(e, itemId)}
                              className="p-1.5 text-gray-400 hover:text-[#0D231E] hover:bg-sand rounded-lg transition-colors cursor-pointer"
                              title="Folder Options"
                            >
                              <Icon icon="lucide:more-vertical" className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 z-30 w-36 bg-white border border-gray-100 rounded-xl shadow-xl p-1 font-inter text-left animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenRenameModal(e, itemId, item.name, true)}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-sand hover:text-emerald-600 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon icon="lucide:pencil" className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Rename</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Render Files Next */}
                {paginatedFiles.map((item) => {
                  const itemId = item.id;
                  const isSelected = selectedUrls.includes(item.url);
                  const isMenuOpen = activeMenuId === itemId;
                  const imgSrc = getImageUrl(item.url || item.path || item.filename || item.name, "/images/placeholders/empty_state.png");

                  return (
                    <tr
                      key={itemId}
                      onClick={() => toggleSelect(item.url || imgSrc)}
                      className={`hover:bg-emerald-50/40 transition-colors cursor-pointer ${
                        isSelected ? "bg-emerald-50/70" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-[#0D231E]">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(imgSrc);
                            }}
                            className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 bg-sand shrink-0 hover:opacity-90 cursor-pointer"
                            title="Preview image"
                          >
                            <Image
                              src={imgSrc}
                              alt={item.name || "File"}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-xs text-[#0D231E] hover:text-emerald-600 truncate max-w-[200px] sm:max-w-[300px]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Image
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-gray-600 font-mono font-semibold">
                        {formatBytes(item.size)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(imgSrc);
                            }}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Preview"
                          >
                            <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenRenameModal(e, itemId, item.name, false)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Rename File"
                          >
                            <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete File"
                          >
                            <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                          </button>

                          <div className="relative menu-container inline-block">
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(e, itemId)}
                              className="p-1.5 text-gray-400 hover:text-[#0D231E] hover:bg-sand rounded-lg transition-colors cursor-pointer"
                              title="File Options"
                            >
                              <Icon icon="lucide:more-vertical" className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 z-30 w-36 bg-white border border-gray-100 rounded-xl shadow-xl p-1 font-inter text-left animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(null);
                                    setPreviewImage(imgSrc);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-sand hover:text-emerald-600 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenRenameModal(e, itemId, item.name, false)}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-sand hover:text-emerald-600 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon icon="lucide:pencil" className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Rename</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW (DEFAULT MODE) */
        <div className="space-y-8 font-inter">
          {/* FOLDERS SECTION */}
          {folders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Icon icon="lucide:folder" className="w-4 h-4 text-emerald-500" />
                <span>Folders ({folders.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {folders.map((item) => {
                  const itemId = item.id;
                  const isMenuOpen = activeMenuId === itemId;

                  return (
                    <div
                      key={itemId}
                      className="group bg-white border border-gray-100 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(13,35,30,0.03)] hover:shadow-[0_12px_30px_rgba(13,35,30,0.08)] transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Top Preview Area with 3D Green Folder Icon */}
                      <div
                        onClick={() => handleOpenFolder(item.name)}
                        className="h-28 bg-[#f4f7f5] group-hover:bg-[#ebf3ef] transition-colors flex items-center justify-center border-b border-gray-100/80 cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon
                            icon="lucide:folder"
                            className="w-10 h-10 text-emerald-500 fill-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="p-3.5 flex items-center justify-between gap-2 relative bg-white">
                        <div
                          onClick={() => handleOpenFolder(item.name)}
                          className="flex items-center gap-2 min-w-0 cursor-pointer"
                        >
                          <Icon icon="lucide:folder" className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#0D231E] group-hover:text-emerald-600 transition-colors truncate">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium truncate">
                              Folder • Admin
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons & Dropdown */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenRenameModal(e, itemId, item.name, true)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Rename Folder"
                          >
                            <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Folder"
                          >
                            <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FILES SECTION */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Icon icon="lucide:image" className="w-4 h-4 text-emerald-500" />
                <span>Files / Media ({files.length})</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedFiles.map((item) => {
                  const itemId = item.id;
                  const isSelected = selectedUrls.includes(item.url);
                  const isMenuOpen = activeMenuId === itemId;
                  const imgSrc = getImageUrl(item.url || item.path || item.filename || item.name, "/images/placeholders/empty_state.png");

                  return (
                    <div
                      key={itemId}
                      onClick={() => toggleSelect(item.url || imgSrc)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden bg-sand border-2 transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? "border-emerald-500 ring-4 ring-emerald-500/30 scale-98"
                          : "border-gray-200 hover:border-emerald-500"
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={item.name || "Media image"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Tick Mark Badge */}
                      {isModal && isSelected && (
                        <div className="absolute top-2 left-2 z-30 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Icon icon="lucide:check" className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Action Dropdown Menu */}
                      <div className="absolute top-2 right-2 z-20 menu-container">
                        <button
                          type="button"
                          onClick={(e) => toggleMenu(e, itemId)}
                          className="p-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-black/80 transition-colors shadow-md cursor-pointer"
                        >
                          <Icon icon="lucide:more-vertical" className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 z-30 w-36 bg-white border border-gray-100 rounded-xl shadow-xl p-1 font-inter text-left animate-in fade-in zoom-in-95 duration-150">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setPreviewImage(imgSrc);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-sand hover:text-emerald-600 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleOpenRenameModal(e, itemId, item.name, false)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-sand hover:text-emerald-600 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Icon icon="lucide:pencil" className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Rename</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleOpenDeleteModal(e, itemId, item.name)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Icon icon="lucide:trash-2" className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* File Title Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[10px] truncate font-medium z-10">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Files Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 font-inter">
                  <span className="text-xs text-gray-500 font-medium">
                    Page <span className="font-bold text-[#0D231E]">{currentPage}</span> of{" "}
                    <span className="font-bold text-[#0D231E]">{totalPages}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#0D231E] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          currentPage === page
                            ? "bg-[#0D231E] text-white border-[#0D231E] shadow-xs"
                            : "bg-white border-gray-200 text-gray-600 hover:border-emerald-500"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#0D231E] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-inter">
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Icon icon="lucide:x" className="w-6 h-6" />
              <span>Close</span>
            </button>
            <div className="relative w-full aspect-auto max-h-[80vh] min-h-[300px] flex items-center justify-center">
              <img
                src={previewImage}
                alt="Full Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-inter">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 font-inter">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#0D231E] flex items-center gap-2">
                <Icon icon="lucide:pencil" className="w-4 h-4 text-emerald-600" />
                <span>Rename {renameModal.isFolder ? "Folder" : "File"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setRenameModal({ open: false, id: null, name: "", isFolder: true })}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRename} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Name
                </label>
                <input
                  type="text"
                  value={renameModal.name}
                  onChange={(e) => setRenameModal({ ...renameModal, name: e.target.value })}
                  autoFocus
                  required
                  className="w-full bg-sand border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0D231E] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameModal({ open: false, id: null, name: "", isFolder: true })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRenaming}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0D231E] hover:bg-[#2cb775] text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isRenaming ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Media Item"
        message={`Are you sure you want to delete ${deleteModal.name ? `"${deleteModal.name}"` : "this item"}? This action cannot be undone.`}
        confirmText="Delete Item"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
