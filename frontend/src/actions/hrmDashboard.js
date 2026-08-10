"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

export const getHrmDashboardStats = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/hrm/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
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
