"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { deleteEmployee } from "@/actions/employee";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/hooks/useAuth";

export default function EmployeesPage({
  employees = [],
  pagination = { page: 1, totalPages: 1, total: 0 },
  departments = [],
  designations = [],
  employmentTypes = [],
  employmentStatuses = [],
  filters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const canManage = !authLoading && user && (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HR_MANAGER");

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const isPrev = Number(pagination.page) === 1;
  const isNext = Number(pagination.page) === pagination.totalPages;

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name, value) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}?${queryString}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryString = createQueryString("search", searchValue);
    router.push(`${pathname}?${queryString}`);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    router.push(pathname);
  };

  const handleSort = (field) => {
    const currentSort = filters.sortBy;
    const currentOrder = filters.sortOrder || "desc";
    let newOrder = "asc";
    if (currentSort === field && currentOrder === "asc") {
      newOrder = "desc";
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", field);
    params.set("sortOrder", newOrder);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setLoading(true);
    const result = await deleteEmployee(deleteModal.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      setDeleteModal({ open: false, id: null });
      return;
    }

    toast.success("Employee deleted successfully!");
    setDeleteModal({ open: false, id: null });
    router.refresh();
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.departmentId ||
    filters.designationId ||
    filters.employmentTypeId ||
    filters.employmentStatusId;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Employees"
        description="View employee directory, roles, and department assignments."
        actionText={canManage ? "Add Employee" : undefined}
        actionHref="/dashboard/employees/create"
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Icon
              icon="lucide:search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2cb775] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0D231E] text-white rounded-xl text-xs font-semibold hover:bg-[#1a3a2f] transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select
            value={filters.departmentId || ""}
            onChange={(e) => handleFilterChange("departmentId", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#2cb775]"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filters.designationId || ""}
            onChange={(e) => handleFilterChange("designationId", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#2cb775]"
          >
            <option value="">All Designations</option>
            {designations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filters.employmentTypeId || ""}
            onChange={(e) => handleFilterChange("employmentTypeId", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#2cb775]"
          >
            <option value="">All Types</option>
            {employmentTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={filters.employmentStatusId || ""}
            onChange={(e) => handleFilterChange("employmentStatusId", e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs bg-white focus:outline-none focus:border-[#2cb775]"
          >
            <option value="">All Statuses</option>
            {employmentStatuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-4">
            <Image
              src="/images/placeholders/empty_state.png"
              width={300}
              height={300}
              priority
              alt="Empty state"
              className="mx-auto opacity-80"
            />
            <p className="text-gray-500 font-medium font-inter text-base">
              No employees found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-4 px-6">Employee</th>
                  <th
                    className="py-4 px-6 cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("employeeId")}
                  >
                    <div className="flex items-center gap-1">
                      ID
                      <Icon icon="lucide:arrow-up-down" className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Designation</th>
                  <th className="py-4 px-6">Status</th>
                  <th
                    className="py-4 px-6 cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("joiningDate")}
                  >
                    <div className="flex items-center gap-1">
                      Joining Date
                      <Icon icon="lucide:arrow-up-down" className="w-3 h-3" />
                    </div>
                  </th>
                  {canManage && <th className="py-4 px-6 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {emp.photo ? (
                          <img
                            src={getImageUrl(emp.photo)}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#2cb775]/10 flex items-center justify-center border border-[#2cb775]/20 text-[#2cb775] font-bold text-xs">
                            {emp.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0D231E]">{emp.name}</p>
                          <p className="text-[11px] text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-600 font-medium">
                      {emp.employeeId}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium">
                        {emp.department?.name || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {emp.designation?.name || "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          emp.employmentStatus?.name === "Active"
                            ? "bg-[#2cb775]/10 text-[#2cb775] border border-[#2cb775]/20"
                            : emp.employmentStatus?.name === "Inactive"
                            ? "bg-gray-100 text-gray-600 border border-gray-200"
                            : emp.employmentStatus?.name === "Probation"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {emp.employmentStatus?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-[11px]">
                      {formatDate(emp.joiningDate)}
                    </td>
                    {canManage && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/employees/${emp.id}`}
                            className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            title="View profile"
                          >
                            <Icon icon="lucide:eye" className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/employees/edit/${emp.id}`}
                            className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Edit employee & status"
                          >
                            <Icon icon="lucide:pencil" className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Link
            href={
              isPrev
                ? `${pathname}?page=1${hasActiveFilters ? `&${new URLSearchParams(
                    Object.fromEntries(
                      Object.entries(filters).filter(([_, v]) => v)
                    )
                  ).toString()}` : ""}`
                : `${pathname}?page=${Number(pagination.page) - 1}${
                    hasActiveFilters
                      ? `&${new URLSearchParams(
                          Object.fromEntries(
                            Object.entries(filters).filter(([_, v]) => v)
                          )
                        ).toString()}`
                      : ""
                  }`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
              isPrev
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: pagination.totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isCurrent = Number(pagination.page) === pageNum;
            if (
              pageNum === 1 ||
              pageNum === pagination.totalPages ||
              Math.abs(pageNum - Number(pagination.page)) <= 2
            ) {
              return (
                <Link
                  key={i}
                  href={`${pathname}?page=${pageNum}${
                    hasActiveFilters
                      ? `&${new URLSearchParams(
                          Object.fromEntries(
                            Object.entries(filters).filter(([_, v]) => v)
                          )
                        ).toString()}`
                      : ""
                  }`}
                  className={`px-3.5 py-2 border rounded-xl text-xs font-bold font-inter transition-all ${
                    isCurrent
                      ? "bg-[#0D231E] border-[#0D231E] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            }
            return null;
          })}

          <Link
            href={
              isNext
                ? `${pathname}?page=${pagination.totalPages}${
                    hasActiveFilters
                      ? `&${new URLSearchParams(
                          Object.fromEntries(
                            Object.entries(filters).filter(([_, v]) => v)
                          )
                        ).toString()}`
                      : ""
                  }`
                : `${pathname}?page=${Number(pagination.page) + 1}${
                    hasActiveFilters
                      ? `&${new URLSearchParams(
                          Object.fromEntries(
                            Object.entries(filters).filter(([_, v]) => v)
                          )
                        ).toString()}`
                      : ""
                  }`
            }
            className={`px-4 py-2 border rounded-xl text-xs font-semibold font-inter transition-all ${
              isNext
                ? "cursor-not-allowed opacity-40 border-gray-200 text-gray-400 bg-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
            }`}
          >
            Next
          </Link>
        </div>
      )}

      {canManage && (
        <ConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={loading}
        />
      )}
    </div>
  );
}
