import { getGalleryImages } from "@/actions/gallery";
import GallerySlider from "@/components/pages/home/GallerySlider";

export default async function Gallery() {
  const result = await getGalleryImages();
  const items = result.success ? result.data : [];
  if (items.length === 0) return null;
  return <GallerySlider items={items} />;
}
