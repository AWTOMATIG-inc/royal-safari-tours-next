import PublicJobDetailPage from "@/components/public/PublicJobDetailPage";

export default async function PublicJobDetail({ params }) {
  const { slug } = await params;
  return <PublicJobDetailPage slug={slug} />;
}
