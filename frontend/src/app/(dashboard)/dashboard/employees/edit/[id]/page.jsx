export const dynamic = "force-dynamic";

import { getEmployeeById } from "@/actions/employee";
import { getDepartments } from "@/actions/department";
import { getDesignations } from "@/actions/designation";
import { getEmploymentTypes } from "@/actions/employmentType";
import { getEmploymentStatuses } from "@/actions/employmentStatus";
import { getEmployees } from "@/actions/employee";
import EmployeeForm from "@/components/dashboard/employee/EmployeeForm";
import Link from "next/link";

export default async function EditEmployee({ params }) {
  const { id } = await params;

  const [
    empResult,
    deptResult,
    desigResult,
    typeResult,
    statusResult,
    empListResult,
  ] = await Promise.all([
    getEmployeeById(id),
    getDepartments(),
    getDesignations(),
    getEmploymentTypes(),
    getEmploymentStatuses(),
    getEmployees(1, { limit: 500 }),
  ]);

  if (!empResult.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{empResult.message || "Employee not found."}</p>
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
      <EmployeeForm
        employee={empResult.data}
        departments={deptResult?.data || []}
        designations={desigResult?.data || []}
        employmentTypes={typeResult?.data || []}
        employmentStatuses={statusResult?.data || []}
        employees={empListResult?.data || []}
      />
    </div>
  );
}
