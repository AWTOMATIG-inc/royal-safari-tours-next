import { getEmployeeSelfProfile } from "@/actions/employee";
import MyProfilePage from "@/components/dashboard/employee/MyProfilePage";

export const metadata = {
  title: "My Profile | Royal Safari Tours HRM",
  description: "View and update your personal employee profile details and documents",
};

export default async function Page() {
  const result = await getEmployeeSelfProfile();

  return (
    <MyProfilePage
      employee={result.success ? result.data : null}
      error={!result.success ? result.message : null}
    />
  );
}
