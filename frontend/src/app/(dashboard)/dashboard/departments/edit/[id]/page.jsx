export const dynamic = "force-dynamic";

import { getDepartmentById } from "@/actions/department";
import DepartmentCreateClient from "@/components/dashboard/department/DepartmentCreateClient";
import Link from "next/link";

export default async function EditDepartment({ params }) {
  const { id } = await params;
  const result = await getDepartmentById(id);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{result.message || "Department not found."}</p>
        <Link
          href="/dashboard/departments"
          className="text-[#2cb775] hover:underline mt-4 inline-block"
        >
          Back to Departments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <DepartmentCreateClient department={result.data} />
    </div>
  );
}
