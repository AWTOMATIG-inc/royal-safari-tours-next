"use server";

import { cookies } from "next/headers";

export const getUsers = async (page = 1) => {
  try {
    const limit = 10;
    const currentPage = Math.max(1, Number(page) || 1);

    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/users?page=${currentPage}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
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
