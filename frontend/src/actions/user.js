"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

export const getUsers = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);

    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/users?page=${currentPage}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch users");
    }

    return {
      success: true,
      data: result.users,
      pagination: {
        page: currentPage,
        limit,
        total: result.pagination?.total || 0,
        totalPages: result.pagination?.totalPages || 1,
      },
    };
  } catch (error) {
    console.error("Get Users Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch users",
    };
  }
};
