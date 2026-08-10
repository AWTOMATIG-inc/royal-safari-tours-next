import DashboardLayoutShell from "@/components/dashboard/DashboardLayoutShell";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value;
  const user = await verifyToken(token);

  if (!user) {
    redirect("/login");
  }

  // Permitted roles for dashboard access
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(user.role)) {
    redirect("/login");
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
