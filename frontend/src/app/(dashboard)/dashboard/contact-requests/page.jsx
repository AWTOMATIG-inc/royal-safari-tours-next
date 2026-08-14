import { getContactRequests } from '@/actions/contactRequest';
import ContactRequestPage from '@/components/dashboard/contact-request/ContactRequestPage';
import toast from 'react-hot-toast';

export default async function ContactRequests({searchParams}) {
   const { page } = await searchParams;
    const results = await getContactRequests(page);
    if (!results.success) {
      toast.error(results.message);
    }
  return (
    <div>
      <ContactRequestPage contactRequests={results?.data} pagination={results?.pagination} />
    </div>
  )
}
