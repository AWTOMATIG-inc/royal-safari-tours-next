export const dynamic = "force-dynamic";

import { getDesignationById } from "@/actions/designation";
import DesignationCreateClient from "@/components/dashboard/designation/DesignationCreateClient";
import Link from "next/link";

export default async function EditDesignation({ params }) {
  const { id } = await params;
  const result = await getDesignationById(id);

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{result.message || "Designation not found."}</p>
        <Link
          href="/dashboard/designations"
          className="text-[#2cb775] hover:underline mt-4 inline-block"
        >
          Back to Designations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <DesignationCreateClient designation={result.data} />
    </div>
  );
}
