"use server";
import { db_connect } from "@/database";
import { SubscriberModel } from "@/database/models/subscribeModel";
export const getSubscribers = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * limit;
     await db_connect();
    const [subscriberData, total] = await Promise.all([
      SubscriberModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      SubscriberModel.countDocuments(),
    ]);
    const subscribers = JSON.parse(JSON.stringify(subscriberData));
    return {
      success: true,
      data: subscribers,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Subscribers Error:", error);

    return {
      success: false,
      message: "Failed to fetch subscribers",
    };
  }
};
