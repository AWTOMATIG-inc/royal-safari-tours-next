export const dynamic = "force-dynamic";

import { getDepartments } from "@/actions/department";
import { getDesignations } from "@/actions/designation";
import { getEmploymentTypes } from "@/actions/employmentType";
import { getEmploymentStatuses } from "@/actions/employmentStatus";
import { getEmployees } from "@/actions/employee";
import EmployeeForm from "@/components/dashboard/employee/EmployeeForm";

export default async function CreateEmployee() {
  const [deptResult, desigResult, typeResult, statusResult, empResult] =
    await Promise.all([
      getDepartments(),
      getDesignations(),
      getEmploymentTypes(),
      getEmploymentStatuses(),
      getEmployees(1, { limit: 500 }),
    ]);

  return (
    <div>
      <EmployeeForm
        departments={deptResult?.data || []}
        designations={desigResult?.data || []}
        employmentTypes={typeResult?.data || []}
        employmentStatuses={statusResult?.data || []}
        employees={empResult?.data || []}
      />
    </div>
  );
}
