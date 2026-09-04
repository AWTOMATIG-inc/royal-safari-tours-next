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

export const getBookingEnquiries = async (page = 1, status = "", search = "") => {
  try {
    const headers = await getAuthHeaders();
    let url = `${BACKEND_URL}/api/v1/booking-enquiries?page=${page}&limit=20`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch booking enquiries");
    const result = await res.json();
    return {
      success: true,
      data: result.data || [],
      pagination: result.meta || { page, limit: 20, total: 0, totalPages: 1 },
    };
  } catch (error) {
    console.error("Get Booking Enquiries Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch booking enquiries",
    };
  }
};
