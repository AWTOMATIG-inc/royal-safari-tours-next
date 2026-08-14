export const dynamic = "force-dynamic";

import { getEmploymentTypeById } from "@/actions/employmentType";
import EmploymentTypeCreateClient from "@/components/dashboard/employment-type/EmploymentTypeCreateClient";
import Link from "next/link";

export default async function EditEmploymentType({ params }) {
  const { id } = await params;
  const result = await getEmploymentTypeById(id);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{result.message || "Employment type not found."}</p>
        <Link
          href="/dashboard/employment-types"
          className="text-[#2cb775] hover:underline mt-4 inline-block"
        >
          Back to Employment Types
        </Link>
      </div>
    );
  }

  return (
    <div>
      <EmploymentTypeCreateClient employmentType={result.data} />
    </div>
  );
}
