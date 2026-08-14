export const dynamic = "force-dynamic";

import { getDesignations } from "@/actions/designation";
import DesignationsPage from "@/components/dashboard/designation/DesignationsPage";

export default async function Designations() {
  const results = await getDesignations();

  if (!results.success) {
    return (
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <p className="text-gray-500 font-inter">{results.message}</p>
      </div>
    );
  }

  return (
    <div>
      <DesignationsPage designations={results?.data || []} />
    </div>
  );
}
