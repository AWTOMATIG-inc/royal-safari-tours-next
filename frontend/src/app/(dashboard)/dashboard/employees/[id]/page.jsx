export const dynamic = "force-dynamic";

import { getEmployeeById } from "@/actions/employee";
import EmployeeProfile from "@/components/dashboard/employee/EmployeeProfile";
import Link from "next/link";

export default async function EmployeeProfilePage({ params }) {
  const { id } = await params;
  const result = await getEmployeeById(id);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{result.message || "Employee not found."}</p>
        <Link
          href="/dashboard/employees"
          className="text-[#2cb775] hover:underline mt-4 inline-block"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div>
      <EmployeeProfile employee={result.data} />
    </div>
  );
}
