export const dynamic = "force-dynamic";

import { getEmploymentStatuses } from "@/actions/employmentStatus";
import EmploymentStatusesPage from "@/components/dashboard/employment-status/EmploymentStatusesPage";

export default async function EmploymentStatuses() {
  const results = await getEmploymentStatuses();

  if (!results.success) {
    return (
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{results.message}</p>
      </div>
    );
  }

  return (
    <div>
      <EmploymentStatusesPage employmentStatuses={results?.data || []} />
    </div>
  );
}
