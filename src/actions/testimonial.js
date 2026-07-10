"use server";
import { db_connect } from "@/database";
import { TestimonialModel } from "@/database/models/testimonialModel";

export const getTestimonials = async () => {
  try {
    await db_connect();
    const data = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    return { success: false, message: "Failed to fetch testimonials" };
  }
};

export const getTestimonialById = async (id) => {
  try {
    await db_connect();
    const data = await TestimonialModel.findById(id).lean();
    if (!data) return { success: false, message: "Testimonial not found" };
    return { success: true, data: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("Get Testimonial By ID Error:", error);
    return { success: false, message: "Failed to fetch testimonial" };
  }
};

export const getTestimonialsByPagination = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * limit;
    await db_connect();
    const [testimonialData, total] = await Promise.all([
      TestimonialModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      TestimonialModel.countDocuments(),
    ]);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(testimonialData)),
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Testimonials Paginated Error:", error);
    return { success: false, message: "Failed to fetch testimonials" };
  }
};
