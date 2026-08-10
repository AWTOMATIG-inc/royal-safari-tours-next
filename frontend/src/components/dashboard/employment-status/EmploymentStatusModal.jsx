"use client";

import { employmentStatusSchema } from "@/yup/employmentStatusSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createEmploymentStatus,
  updateEmploymentStatus,
} from "@/actions/employmentStatus";

export default function EmploymentStatusModal({
  employmentStatus = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!employmentStatus;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: employmentStatus?.name || "",
    },
    resolver: yupResolver(employmentStatusSchema),
  });

  useEffect(() => {
    if (employmentStatus) {
      reset({
        name: employmentStatus.name || "",
      });
    }
  }, [employmentStatus, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    const result = isEdit
      ? await updateEmploymentStatus(employmentStatus.id, data)
      : await createEmploymentStatus(data);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      isEdit
        ? "Employment status updated successfully!"
        : "Employment status created successfully!"
    );
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-body">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0D231E] font-heading">
            {isEdit ? "Edit Employment Status" : "Create Employment Status"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Employment Status Name *
            </label>
            <input
              type="text"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
              placeholder="e.g., Active, Probation, Inactive"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2cb775] hover:bg-[#25a564] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Employment Status"
                : "Create Employment Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
