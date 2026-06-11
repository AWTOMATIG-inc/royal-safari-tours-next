import { getGalleryImages } from "@/actions/gallery";
import GalleryPage from "@/components/dashboard/gallery/GalleryPage";

export default async function DashboardGalleryPage() {
  const result = await getGalleryImages();
  const images = result.success ? result.data : [];
  return <GalleryPage images={images} />;
}
