import { getClientGalleryItems } from "@/actions/clientGallery";
import ClientGalleryHero from "@/components/pages/client-gallery/ClientGalleryHero";
import ClientGallerySection from "@/components/pages/client-gallery/ClientGallerySection";

export const metadata = {
  title: "Clients Gallery | Royal Safari Tours",
  description:
    "Discover authentic traveler photos, expedition moments, and luxury safari memories captured by Royal Safari Tours clients across South Asia and beyond.",
};

export default async function PublicClientGalleryPage() {
  const result = await getClientGalleryItems();
  const items = result.success ? result.data : [];

  return (
    <main className="min-h-screen font-body">
      <ClientGalleryHero />
      <ClientGallerySection initialItems={items} />
    </main>
  );
}
