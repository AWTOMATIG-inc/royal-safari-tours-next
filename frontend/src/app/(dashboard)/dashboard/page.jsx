import { getInvoices } from "@/actions/invoice";
import { getContactRequests } from "@/actions/contactRequest";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const [invoicesRes, contactsRes] = await Promise.allSettled([
    getInvoices(),
    getContactRequests(1),
  ]);

  const invoices = invoicesRes.status === "fulfilled" && invoicesRes.value?.success ? invoicesRes.value.data : [];
  const contactRequests = contactsRes.status === "fulfilled" && contactsRes.value?.success ? contactsRes.value.data : [];
  const totalInquiries = contactsRes.status === "fulfilled" && contactsRes.value?.pagination?.total ? contactsRes.value.pagination.total : contactRequests.length;

  return (
    <DashboardClient
      invoices={invoices}
      contactRequests={contactRequests}
      totalInquiries={totalInquiries}
    />
  );
}
