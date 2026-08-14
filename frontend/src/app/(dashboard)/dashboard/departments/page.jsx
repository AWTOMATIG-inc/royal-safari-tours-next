export const dynamic = "force-dynamic";

import { getDepartments } from "@/actions/department";
import DepartmentsPage from "@/components/dashboard/department/DepartmentsPage";

export default async function Departments() {
  const results = await getDepartments();

  if (!results.success) {
    return (
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{results.message}</p>
      </div>
    );
  }

  return (
    <div>
      <DepartmentsPage departments={results?.data || []} />
    </div>
  );
}
