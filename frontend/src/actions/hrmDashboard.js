"use server";

import { cookies } from "next/headers";

export const getHrmDashboardStats = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/hrm/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch HRM dashboard stats from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch HRM dashboard stats");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get HRM Dashboard Stats Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch HRM dashboard stats",
    };
  }
};
