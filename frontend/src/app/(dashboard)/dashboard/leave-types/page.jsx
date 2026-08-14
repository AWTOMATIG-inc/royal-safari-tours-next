import { getLeaveTypes } from "@/actions/leave";
import LeaveTypesPage from "@/components/dashboard/leave-type/LeaveTypesPage";

export default async function Page() {
  const result = await getLeaveTypes();
  const leaveTypes = result.success ? result.data : [];

  return <LeaveTypesPage initialLeaveTypes={leaveTypes} />;
}
