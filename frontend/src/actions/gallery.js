"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getGalleryImages = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch gallery items");
    const result = await res.json();
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error("Get Gallery Images Error:", error);
    return { success: false, data: [], message: error.message || "Failed to fetch gallery images" };
  }
};
