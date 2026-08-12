import { getAllLeaveApplications } from "@/actions/leave";
import LeaveApplicationsPage from "@/components/dashboard/leave-application/LeaveApplicationsPage";

export default async function Page() {
  const result = await getAllLeaveApplications();
  const applications = result.success ? result.data : [];

  return <LeaveApplicationsPage initialApplications={applications} />;
}
