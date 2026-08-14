"use server";

import { db_connect } from "@/database";
import { ContactModel } from "@/database/models/contactModel";

export const getContactRequests = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * limit;
     await db_connect();
    const [contactRequestData, total] = await Promise.all([
      ContactModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      ContactModel.countDocuments(),
    ]);
    const contactRequests = JSON.parse(JSON.stringify(contactRequestData));
    return {
      success: true,
      data: contactRequests,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Contact Requests Error:", error);

    return {
      success: false,
      message: "Failed to fetch contact requests",
    };
  }
};
