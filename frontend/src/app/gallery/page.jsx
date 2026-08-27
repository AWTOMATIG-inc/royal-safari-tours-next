import { getGalleryImages } from "@/actions/gallery";
import TravelerGallerySection from "@/components/pages/gallery/TravelerGallerySection";

export const metadata = {
  title: "Client & Traveler Image Gallery | Royal Safari Tours",
  description:
    "Discover real traveler photos, expedition moments, and luxury safari memories captured by Royal Safari Tours clients across South Asia and beyond.",
};

export default async function PublicGalleryPage() {
  const result = await getGalleryImages({ isPublished: true });
  const items = result.success ? result.data : [];

  return (
    <main className="min-h-screen pt-24 bg-body font-body">
      <TravelerGallerySection initialItems={items} />
    </main>
  );
}
