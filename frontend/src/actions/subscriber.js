"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

const BACKEND_URL = getBackendUrl();

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

export const getSubscribers = async (page = 1) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/v1/subscribers?page=${page}&limit=10`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch subscribers");
    const result = await res.json();
    return {
      success: true,
      data: result.data || [],
      pagination: result.meta || { page, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch subscribers",
    };
  }
};
