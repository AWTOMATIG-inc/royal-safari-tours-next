"use client";

import MediaGalleryView from "./MediaGalleryView";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function MediaGalleryModal({
  isOpen,
  onClose,
  onSelectImage,
  multiple = false,
  title = "Select Media Image",
  initialSelected = null,
}) {
  const [selectedUrls, setSelectedUrls] = useState([]);

  // Initialize selectedUrls whenever modal opens or initialSelected changes
  useEffect(() => {
    if (!isOpen) return;
    if (!initialSelected) {
      setSelectedUrls([]);
    } else if (Array.isArray(initialSelected)) {
      setSelectedUrls(initialSelected.filter(Boolean));
    } else if (typeof initialSelected === "string") {
      setSelectedUrls([initialSelected]);
    }
  }, [isOpen, initialSelected]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!onSelectImage) return;

    if (!multiple) {
      onSelectImage(selectedUrls[0] || "");
    } else {
      onSelectImage(selectedUrls);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-inter">
      <div className="bg-white rounded-3xl max-w-5xl w-full flex flex-col max-h-[90vh] shadow-2xl border border-gray-100 relative font-inter overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 font-inter">
          <div>
            <h3 className="text-lg font-bold text-[#0D231E]">{title}</h3>
            <p className="text-xs text-gray-500 font-light">
              {multiple
                ? "Click images to toggle selection (highlighted with green tick), then click OK / Save Selection."
                : "Click 1 image to select, then click OK / Save Selection."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Media View Body */}
        <div className="flex-1 overflow-y-auto p-6 font-inter">
          <MediaGalleryView
            isModal={true}
            onSelectImage={onSelectImage}
            multiple={multiple}
            onCloseModal={onClose}
            initialSelected={initialSelected}
            selectedUrls={selectedUrls}
            setSelectedUrls={setSelectedUrls}
          />
        </div>

        {/* Fixed Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-gray-100 bg-sand/60 flex items-center justify-between shrink-0 font-inter">
          <div className="text-xs text-primary font-medium flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
              {selectedUrls.length}
            </span>
            <span>{selectedUrls.length === 1 ? "picture selected" : "pictures selected"}</span>
          </div>

          <div className="flex items-center gap-3 font-inter">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-400" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
