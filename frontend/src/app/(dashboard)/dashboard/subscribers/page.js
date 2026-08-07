import { getSubscribers } from "@/actions/subscriber";
import SubscibersPage from "@/components/dashboard/subscribers/SubscribersPage";
import toast from "react-hot-toast";

export default async function Subscribers({searchParams }) {
  const { page } = await searchParams;
  const results = await getSubscribers(page);
  if (!results.success) {
    toast.error(results.message);
  }
  return (
    <div>
      <SubscibersPage
        subscribers={results.data}
        pagination={results.pagination}
      />
    </div>
  );
}
