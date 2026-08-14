"use server";
import { db_connect } from "@/database";
import { TourLocationModel } from "@/database/models/tourLocationModel";
import { TourPackageModel } from "@/database/models/tourPackageModel";
export const getTourPackages = async (page = 1) => {
  try {
    const limit = 6;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * limit;
    await db_connect();
    const [tourPackageData, total] = await Promise.all([
      TourPackageModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      TourPackageModel.countDocuments(),
    ]);
    const tourPackages = JSON.parse(JSON.stringify(tourPackageData));
    return {
      success: true,
      data: tourPackages,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Tour Packages Error:", error);

    return {
      success: false,
      message: "Failed to fetch tour packages",
    };
  }
};

export const getTourPackageBySlug = async (slug) => {
  try {
    await db_connect();
    const tourPackageData = await TourPackageModel.findOne({ slug: slug })
      .sort({ createdAt: -1 })
      .lean();
    const tourPackages = JSON.parse(JSON.stringify(tourPackageData));
    return { data: tourPackages, success: true };
  } catch (error) {
    console.error("Get Tour Package by Slug Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour packages",
    };
  }
};

export const getTourPackageByLocation = async (location = "all") => {
  try {
    await db_connect();
    const tourPackageData = await TourPackageModel.find({
      location: location == "all" ? /./ : location,
    })
      .sort({ createdAt: -1 })
      .lean();
    const tourPackages = JSON.parse(JSON.stringify(tourPackageData));
    return { data: tourPackages, success: true };
  } catch (error) {
    console.error("Get Tour Packages by Location Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour packages",
    };
  }
};
export const getTourPackagesAndLocations = async () => {
  try {
    await db_connect();
    const [tourPackageData, tourLocationData] = await Promise.all([
      TourPackageModel.find().sort({ createdAt: -1 }).lean(),
      TourLocationModel.find().sort({ createdAt: -1 }).lean(),
    ]);
    const tourPackages = JSON.parse(JSON.stringify(tourPackageData));
    const tourLocations = JSON.parse(JSON.stringify(tourLocationData));
    return {
      locations: tourLocations,
      tourPackages: tourPackages,
      success: true,
    };
  } catch (error) {
    console.error("Get Tour Packages by Location Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour packages",
    };
  }
};
export const getTourPackageWithSlugAndLocations = async (slug) => {
  try {
    await db_connect();
    const [tourPackageData, tourLocationData] = await Promise.all([
      TourPackageModel.findOne({ slug }).sort({ createdAt: -1 }).lean(),
      TourLocationModel.find().sort({ createdAt: -1 }).lean(),
    ]);
    const tourPackage = JSON.parse(JSON.stringify(tourPackageData));
    const tourLocations = JSON.parse(JSON.stringify(tourLocationData));
    return {
      locations: tourLocations,
      tourPackage: tourPackage,
      success: true,
    };
  } catch (error) {
    console.error("Get Tour Package by Slug Error:", error);
    return {
      success: false,
      message: "Failed to fetch tour packages",
    };
  }
};
