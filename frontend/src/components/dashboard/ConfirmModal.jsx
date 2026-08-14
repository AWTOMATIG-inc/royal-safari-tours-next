"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "lucide:alert-triangle",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      confirmBtn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    },
    warning: {
      icon: "lucide:alert-circle",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      confirmBtn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      icon: "lucide:info",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    success: {
      icon: "lucide:check-circle",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-body">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-14 h-14 rounded-full ${style.iconBg} flex items-center justify-center`}
            >
              <Icon
                icon={style.icon}
                className={`w-7 h-7 ${style.iconColor}`}
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#0D231E] text-center font-heading mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl focus:outline-none focus:ring-2 transition-all disabled:opacity-50 cursor-pointer ${style.confirmBtn}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
