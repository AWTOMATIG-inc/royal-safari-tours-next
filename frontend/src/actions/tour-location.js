"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getTourLocations = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch tour locations");
    const result = await res.json();
    return { data: result.data || [], success: true };
  } catch (error) {
    console.error("Get Tour Locations Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch tour locations",
    };
  }
};

export const getTourLocationsByPagination = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch tour locations");
    const result = await res.json();
    const data = result.data || [];
    const pagination = result.meta || {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit) || 1,
    };
    return {
      success: true,
      data,
      pagination,
    };
  } catch (error) {
    console.error("Get Tour Locations Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch tour locations",
    };
  }
};

export const getTourLocationBySlug = async (slug) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch tour location");
    const result = await res.json();
    return { data: result.data, success: true };
  } catch (error) {
    console.error("Get Tour Location by Slug Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch tour location",
    };
  }
};
