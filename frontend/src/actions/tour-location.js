"use server";
import { db_connect } from "@/database";
import { TourLocationModel } from "@/database/models/tourLocationModel";
export const getTourLocationsByPagination = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * limit;
    await db_connect();
    const [tourLocationData, total] = await Promise.all([
      TourLocationModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      TourLocationModel.countDocuments(),
    ]);
    const tourLocations = JSON.parse(JSON.stringify(tourLocationData));
    return {
      success: true,
      data: tourLocations,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Tour Locations Error:", error);

    return {
      success: false,
      message: "Failed to fetch tour locations",
    };
  }
};

export const getTourLocations = async () => {
  try {
    await db_connect();
    const tourLocationData = await TourLocationModel.find()
      .sort({ createdAt: -1 })
      .lean();
   
    const tourLocations = JSON.parse(JSON.stringify(tourLocationData));
    return { data: tourLocations, success: true };
  } catch (error) {
    console.error("Get Tour Locations Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour locations",
    };
  }
};

export const getTourLocationBySlug = async (slug) => {
  try {
    await db_connect();
    const tourLocationData = await TourLocationModel.findOne({ slug: slug })
      .sort({ createdAt: -1 })
      .lean();
      const tourLocation = JSON.parse(JSON.stringify(tourLocationData));
    return { data:tourLocation, success: true };
  } catch (error) {
    console.error("Get Tour Location by Slug Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour location",
    };
  }
};
