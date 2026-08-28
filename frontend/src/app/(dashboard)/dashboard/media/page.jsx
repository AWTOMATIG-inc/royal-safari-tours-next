import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import MediaGalleryView from "@/components/dashboard/media/MediaGalleryView";

export const metadata = {
  title: "Media Gallery | Royal Safari Tours Admin",
  description: "Organize media uploads into nested folders and manage image assets.",
};

export default function StandaloneMediaGalleryPage() {
  return (
    <div className="max-w-8xl mx-auto space-y-6 font-inter">
      <DashboardPageHeader
        title="Media Gallery"
        description="Organize image assets with hierarchical folders (Root ➔ Tours ➔ Coral Island) and manage media uploads."
      />
      <MediaGalleryView isModal={false} />
    </div>
  );
}
