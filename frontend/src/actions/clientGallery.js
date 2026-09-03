"use server";

import { getBackendUrl } from "@/config/env";

export const getClientGalleryItems = async (query = {}) => {
  try {
    const backendUrl = getBackendUrl();
    const searchParams = new URLSearchParams();
    if (query.destination) searchParams.append("destination", query.destination);
    if (query.search) searchParams.append("search", query.search);

    const queryString = searchParams.toString();
    const res = await fetch(
      `${backendUrl}/api/v1/gallery${queryString ? `?${queryString}` : ""}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch client gallery items");
    const result = await res.json();
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error("Get Client Gallery Items Error:", error);
    return { success: false, data: [] };
  }
};
