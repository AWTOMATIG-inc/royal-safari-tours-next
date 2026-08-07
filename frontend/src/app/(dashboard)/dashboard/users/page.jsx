import { getUsers } from "@/actions/user";
import UsersPage from "@/components/dashboard/user/UsersPage";
import toast from "react-hot-toast";
export default async function Users({ searchParams }) {
  const { page } = await searchParams;
  const results = await getUsers(page);
  if (!results.success) {
    toast.error(results.message);
  }
  return (
    <div>
      <UsersPage users={results?.data} pagination={results?.pagination} />
    </div>
  );
}
