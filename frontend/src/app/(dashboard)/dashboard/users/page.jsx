import { getUsers } from "@/actions/user";
import UsersPage from "@/components/dashboard/user/UsersPage";

export default async function Users({ searchParams }) {
  const { page } = await searchParams;
  const results = await getUsers(page);

  return (
    <div>
      <UsersPage users={results?.data || []} pagination={results?.pagination} />
    </div>
  );
}
