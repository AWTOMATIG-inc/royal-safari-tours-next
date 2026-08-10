"use client";

import DepartmentModal from "@/components/dashboard/department/DepartmentModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DepartmentCreateClient({ department = null }) {
  const router = useRouter();
  const isEdit = !!department;

  const handleClose = () => {
    router.push("/dashboard/departments");
  };

  const handleSuccess = () => {
    router.push("/dashboard/departments");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mt-10">
        <div className="flex justify-between items-center mt-8 font-body">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E] font-heading">
            {isEdit ? "Edit Department" : "Create Department"}
          </h1>
          <Link
            className="bg-secondary hover:bg-accent text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xs hover:shadow-md"
            href="/dashboard/departments"
          >
            See Departments
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] mt-8">
          <DepartmentModal
            department={department}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
