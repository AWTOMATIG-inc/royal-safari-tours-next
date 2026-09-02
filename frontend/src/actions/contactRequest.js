"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getAuthHeaders = async (extraHeaders = {}) => {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;
  const headers = { ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["Cookie"] = `token=${token}; accessToken=${token}`;
  }
  return headers;
};

export const getContactRequests = async (page = 1) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/v1/contacts?page=${page}&limit=10`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch contact inquiries");
    const result = await res.json();
    return {
      success: true,
      data: result.data || [],
      pagination: result.meta || { page, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (error) {
    console.error("Get Contact Requests Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch contact requests",
    };
  }
};
