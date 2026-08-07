import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
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

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-inter">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 px-4 sm:px-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
