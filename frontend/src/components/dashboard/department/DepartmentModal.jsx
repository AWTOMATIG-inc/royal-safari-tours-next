"use client";

import { departmentSchema } from "@/yup/departmentSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createDepartment, updateDepartment } from "@/actions/department";

export default function DepartmentModal({
  department = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!department;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
    resolver: yupResolver(departmentSchema),
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name || "",
        description: department.description || "",
      });
    }
  }, [department, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    const result = isEdit
      ? await updateDepartment(department.id, data)
      : await createDepartment(data);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      isEdit
        ? "Department updated successfully!"
        : "Department created successfully!"
    );
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-body">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0D231E] font-heading">
            {isEdit ? "Edit Department" : "Create Department"}
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
              Department Name *
            </label>
            <input
              type="text"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
              placeholder="Enter department name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm min-h-[80px]"
              placeholder="Enter department description (optional)"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
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
                ? "Update Department"
                : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
