"use client";

import Button from "@/components/Button";
import { employeeSchema } from "@/yup/employeeSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createEmployee, updateEmployee } from "@/actions/employee";
import { getImageUrl } from "@/lib/getImageUrl";

export default function EmployeeForm({
  employee = null,
  departments = [],
  designations = [],
  employmentTypes = [],
  employmentStatuses = [],
  employees = [],
}) {
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(
    employee?.photo ? getImageUrl(employee.photo) : null
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [createAccount, setCreateAccount] = useState(false);
  const fileInputRef = useRef(null);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      departmentId: employee?.departmentId || "",
      designationId: employee?.designationId || "",
      employmentTypeId: employee?.employmentTypeId || "",
      employmentStatusId: employee?.employmentStatusId || "",
      joiningDate: employee?.joiningDate
        ? new Date(employee.joiningDate).toISOString().split("T")[0]
        : "",
      managerId: employee?.managerId || "",
      hrNotes: employee?.hrNotes || "",
      password: "",
    },
    resolver: yupResolver(employeeSchema(isEdit)),
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onError = (formErrors) => {
    console.error("Employee Form Validation Errors:", formErrors);
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey && formErrors[firstKey]?.message) {
      toast.error(formErrors[firstKey].message);
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      if (!isEdit) {
        formData.append("createUserAccount", createAccount ? "true" : "false");
      }

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const result = isEdit
        ? await updateEmployee(employee.id, formData)
        : await createEmployee(formData);

      setLoading(false);

      if (!result.success) {
        toast.error(result.message || "Failed to save employee profile");
        return;
      }

      toast.success(
        isEdit
          ? "Employee updated successfully!"
          : "Employee created successfully!"
      );
      router.push("/dashboard/employees");
      router.refresh();
    } catch (err) {
      setLoading(false);
      console.error("Employee Submit Error:", err);
      toast.error(err.message || "An error occurred while saving employee profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mt-10">
        <div className="flex justify-between items-center mt-8 font-body">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-heading">
            {isEdit ? "Update Employee" : "Create New Employee"}
          </h1>
          <Link
            className="bg-secondary hover:bg-accent text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xs hover:shadow-md"
            href="/dashboard/employees"
          >
            See Employees
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="mt-8 space-y-6"
        >
          {/* Photo Upload Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#2cb775]/10 flex items-center justify-center border-4 border-gray-100">
                    <Icon
                      icon="lucide:user"
                      className="w-10 h-10 text-[#2cb775]"
                    />
                  </div>
                )}
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <Icon icon="lucide:x" className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer transition-colors"
                >
                  <Icon icon="lucide:upload" className="w-4 h-4" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or WebP. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                  placeholder="Enter full name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                  placeholder="Enter email address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                  placeholder="Enter phone number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {!isEdit && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="createAccount"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 text-[#2cb775] border-gray-300 rounded focus:ring-[#2cb775]"
                    />
                    <label
                      htmlFor="createAccount"
                      className="text-sm font-semibold text-gray-700 cursor-pointer"
                    >
                      Create user account for this employee
                    </label>
                  </div>
                  {createAccount && (
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Password (Min 6 characters)
                      </label>
                      <input
                        type="password"
                        className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                        placeholder="Enter password (optional, defaults to Employee@123)"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Employment Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Department *
                </label>
                <select
                  {...register("departmentId")}
                  className={`border p-3 rounded-xl w-full focus:outline-none text-sm ${
                    errors.departmentId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#2cb775]"
                  }`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Designation *
                </label>
                <select
                  {...register("designationId")}
                  className={`border p-3 rounded-xl w-full focus:outline-none text-sm ${
                    errors.designationId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#2cb775]"
                  }`}
                >
                  <option value="">Select designation</option>
                  {designations.map((desig) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.name}
                    </option>
                  ))}
                </select>
                {errors.designationId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.designationId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Employment Type *
                </label>
                <select
                  {...register("employmentTypeId")}
                  className={`border p-3 rounded-xl w-full focus:outline-none text-sm ${
                    errors.employmentTypeId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#2cb775]"
                  }`}
                >
                  <option value="">Select employment type</option>
                  {employmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.employmentTypeId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employmentTypeId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Employment Status *
                </label>
                <select
                  {...register("employmentStatusId")}
                  className={`border p-3 rounded-xl w-full focus:outline-none text-sm ${
                    errors.employmentStatusId
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#2cb775]"
                  }`}
                >
                  <option value="">Select employment status</option>
                  {employmentStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
                {errors.employmentStatusId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employmentStatusId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                  {...register("joiningDate")}
                />
                {errors.joiningDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.joiningDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Reporting Manager
                </label>
                <select
                  {...register("managerId")}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm"
                >
                  <option value="">Select manager (optional)</option>
                  {employees
                    .filter((emp) => emp.id !== employee?.id)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                </select>
                {errors.managerId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.managerId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* HR Notes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Additional Notes
            </h2>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                HR Notes
              </label>
              <textarea
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#2cb775] transition-colors text-sm min-h-[80px]"
                placeholder="Internal HR notes (visible only to HR managers)"
                {...register("hrNotes")}
              />
              {errors.hrNotes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hrNotes.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/dashboard/employees"
              className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              name={loading ? "Saving..." : isEdit ? "Update Employee" : "Create Employee"}
              className="bg-secondary! hover:bg-accent! text-white! rounded-xl!"
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
