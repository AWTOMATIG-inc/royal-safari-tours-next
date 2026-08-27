import { getClientGalleryItems } from "@/actions/clientGallery";
import ClientGalleryPage from "@/components/dashboard/client-gallery/ClientGalleryPage";

export default async function DashboardClientGalleryPage() {
  const result = await getClientGalleryItems();
  const items = result.success ? result.data : [];
  return <ClientGalleryPage items={items} />;
}
