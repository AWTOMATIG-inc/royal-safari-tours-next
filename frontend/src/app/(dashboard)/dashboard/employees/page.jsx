export const dynamic = "force-dynamic";

import { getEmployees } from "@/actions/employee";
import { getDepartments } from "@/actions/department";
import { getDesignations } from "@/actions/designation";
import { getEmploymentTypes } from "@/actions/employmentType";
import { getEmploymentStatuses } from "@/actions/employmentStatus";
import EmployeesPage from "@/components/dashboard/employee/EmployeesPage";

export default async function Employees({ searchParams }) {
  const params = await searchParams;
  const { page, search, departmentId, designationId, employmentTypeId, employmentStatusId, sortBy, sortOrder } = params || {};

  const [empResult, deptResult, desigResult, typeResult, statusResult] =
    await Promise.all([
      getEmployees(page, { search, departmentId, designationId, employmentTypeId, employmentStatusId, sortBy, sortOrder }),
      getDepartments(),
      getDesignations(),
      getEmploymentTypes(),
      getEmploymentStatuses(),
    ]);

  return (
    <div>
      <EmployeesPage
        employees={empResult?.data || []}
        pagination={empResult?.pagination || { page: 1, totalPages: 1, total: 0 }}
        departments={deptResult?.data || []}
        designations={desigResult?.data || []}
        employmentTypes={typeResult?.data || []}
        employmentStatuses={statusResult?.data || []}
        filters={{ search, departmentId, designationId, employmentTypeId, employmentStatusId, sortBy, sortOrder }}
      />
    </div>
  );
}
