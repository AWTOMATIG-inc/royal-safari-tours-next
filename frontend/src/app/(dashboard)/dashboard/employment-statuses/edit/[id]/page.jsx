export const dynamic = "force-dynamic";

import { getEmploymentStatusById } from "@/actions/employmentStatus";
import EmploymentStatusCreateClient from "@/components/dashboard/employment-status/EmploymentStatusCreateClient";
import Link from "next/link";

export default async function EditEmploymentStatus({ params }) {
  const { id } = await params;
  const result = await getEmploymentStatusById(id);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{result.message || "Employment status not found."}</p>
        <Link
          href="/dashboard/employment-statuses"
          className="text-[#2cb775] hover:underline mt-4 inline-block"
        >
          Back to Employment Statuses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <EmploymentStatusCreateClient employmentStatus={result.data} />
    </div>
  );
}
