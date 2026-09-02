import { getContactRequests } from "@/actions/contactRequest";
import ContactRequestPage from "@/components/dashboard/contact-request/ContactRequestPage";

export default async function ContactRequests({ searchParams }) {
  const { page } = await searchParams;
  const results = await getContactRequests(page);

  return (
    <div>
      <ContactRequestPage
        contactRequests={results?.data || []}
        pagination={results?.pagination}
      />
    </div>
  );
}
