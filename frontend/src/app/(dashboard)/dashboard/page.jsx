import { getHrmDashboardStats } from "@/actions/hrmDashboard";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const hrmStatsResult = await getHrmDashboardStats();

  return (
    <DashboardClient
      hrmStats={hrmStatsResult.success ? hrmStatsResult.data : null}
    />
  );
}
