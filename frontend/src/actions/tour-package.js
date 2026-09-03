"use server";

import { getBackendUrl } from "@/config/env";

const BACKEND_URL = getBackendUrl();

export const getTourPackages = async (page = 1, limit = 6, status = "published") => {
  try {
    const publishedQuery = status === "all" ? "" : "&isPublished=true";
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-packages?page=${page}&limit=${limit}${publishedQuery}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch tour packages");
    const result = await res.json();
    return {
      success: true,
      data: result.data || [],
      tourPackages: result.data || [],
      packages: result.data || [],
      pagination: result.meta || { page, limit, total: 0, totalPages: 1 },
    };
  } catch (error) {
    console.error("Get Tour Packages Error:", error);
    return {
      success: false,
      data: [],
      tourPackages: [],
      packages: [],
      message: error.message || "Failed to fetch tour packages",
    };
  }
};

export const getTourPackageBySlug = async (slug) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-packages/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch tour package");
    const result = await res.json();
    return { data: result.data, tourPackage: result.data, success: true };
  } catch (error) {
    console.error("Get Tour Package by Slug Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch tour package",
    };
  }
};

export const getTourPackageByLocation = async (location = "all") => {
  try {
    const locQuery = location && location !== "all" ? `&location=${encodeURIComponent(location)}` : "";
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-packages?isPublished=true${locQuery}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch location packages");
    const result = await res.json();
    return { data: result.data || [], tourPackages: result.data || [], packages: result.data || [], success: true };
  } catch (error) {
    console.error("Get Tour Package by Location Error:", error);
    return {
      success: false,
      data: [],
      tourPackages: [],
      packages: [],
      message: error.message || "Failed to fetch tour packages",
    };
  }
};

export const getTourPackagesAndLocations = async () => {
  try {
    const [packagesRes, locationsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/tour-packages?isPublished=true`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/api/v1/tour-locations`, { cache: "no-store" }),
    ]);

    const packagesData = packagesRes.ok ? await packagesRes.json() : { data: [] };
    const locationsData = locationsRes.ok ? await locationsRes.json() : { data: [] };

    const packageList = packagesData.data || [];
    const locationList = locationsData.data || [];

    return {
      success: true,
      packages: packageList,
      tourPackages: packageList,
      data: packageList,
      locations: locationList,
    };
  } catch (error) {
    console.error("Get Tour Packages and Locations Error:", error);
    return {
      success: false,
      packages: [],
      tourPackages: [],
      data: [],
      locations: [],
      message: error.message || "Failed to fetch packages and locations",
    };
  }
};

export const getTourPackageWithSlugAndLocations = async (slug) => {
  try {
    const [packageRes, locationsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/tour-packages/${slug}`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/api/v1/tour-locations`, { cache: "no-store" }),
    ]);

    const packageData = packageRes.ok ? await packageRes.json() : { data: null };
    const locationsData = locationsRes.ok ? await locationsRes.json() : { data: [] };

    return {
      success: true,
      tourPackage: packageData.data || null,
      package: packageData.data || null,
      locations: locationsData.data || [],
    };
  } catch (error) {
    console.error("Get Tour Package with Slug and Locations Error:", error);
    return {
      success: false,
      tourPackage: null,
      package: null,
      locations: [],
      message: error.message || "Failed to fetch package and locations",
    };
  }
};
