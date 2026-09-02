import { getSubscribers } from "@/actions/subscriber";
import SubscibersPage from "@/components/dashboard/subscribers/SubscribersPage";

export default async function Subscribers({ searchParams }) {
  const { page } = await searchParams;
  const results = await getSubscribers(page);

  return (
    <div>
      <SubscibersPage
        subscribers={results?.data || []}
        pagination={results?.pagination}
      />
    </div>
  );
}
