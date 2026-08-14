"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createLeaveType, updateLeaveType } from "@/actions/leave";

export default function LeaveTypeModal({ isOpen, onClose, leaveType = null, onSuccess }) {
  const isEditing = Boolean(leaveType);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultDaysPerYear, setDefaultDaysPerYear] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leaveType) {
      setName(leaveType.name || "");
      setDescription(leaveType.description || "");
      setDefaultDaysPerYear(leaveType.defaultDaysPerYear || 10);
    } else {
      setName("");
      setDescription("");
      setDefaultDaysPerYear(10);
    }
  }, [leaveType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      description,
      defaultDaysPerYear: Number(defaultDaysPerYear),
    };

    const result = isEditing
      ? await updateLeaveType(leaveType.id, payload)
      : await createLeaveType(payload);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Failed to save leave policy");
      return;
    }

    toast.success(
      isEditing
        ? "Leave policy updated successfully!"
        : "Leave policy created successfully!"
    );
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 font-body">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-[#0D231E] font-heading flex items-center gap-2">
            <Icon icon="lucide:calendar-range" className="w-5 h-5 text-[#2cb775]" />
            {isEditing ? "Edit Leave Policy" : "Add Leave Policy"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Policy Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Leave Policy Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Casual Leave, Sick Leave, Paid Leave"
              className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
            />
          </div>

          {/* Default Days Per Year Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Default Allocated Days Per Year *
            </label>
            <input
              type="number"
              required
              min={1}
              max={365}
              value={defaultDaysPerYear}
              onChange={(e) => setDefaultDaysPerYear(e.target.value)}
              placeholder="10"
              className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description / Policy Guidelines
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of policy entitlement and usage rules..."
              className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#2cb775] hover:bg-[#259b63] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Policy"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
