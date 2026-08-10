export const dynamic = "force-dynamic";

import { getEmploymentTypes } from "@/actions/employmentType";
import EmploymentTypesPage from "@/components/dashboard/employment-type/EmploymentTypesPage";

export default async function EmploymentTypes() {
  const results = await getEmploymentTypes();

  if (!results.success) {
    return (
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{results.message}</p>
      </div>
    );
  }

  return (
    <div>
      <EmploymentTypesPage employmentTypes={results?.data || []} />
    </div>
  );
}
