"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getTestimonials = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/testimonials?isPublished=true`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    const result = await res.json();
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    return { success: false, data: [], message: error.message || "Failed to fetch testimonials" };
  }
};

export const getTestimonialById = async (id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/testimonials/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch testimonial");
    const result = await res.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Testimonial By ID Error:", error);
    return { success: false, message: error.message || "Failed to fetch testimonial" };
  }
};

export const getTestimonialsByPagination = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/testimonials?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch testimonials");
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
    console.error("Get Testimonials Paginated Error:", error);
    return { success: false, data: [], message: error.message || "Failed to fetch testimonials" };
  }
};
