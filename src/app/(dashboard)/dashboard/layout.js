import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value;
  const isAdmin = await verifyToken(token);
  if (!isAdmin) {
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
