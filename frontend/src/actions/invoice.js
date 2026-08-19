"use server";

import { cookies } from "next/headers";

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

export const getInvoices = async (searchParams = {}) => {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized", data: [] };

    const backendUrl = getBackendUrl();
    const query = new URLSearchParams();
    if (searchParams.search) query.append("search", searchParams.search);
    if (searchParams.startDate) query.append("startDate", searchParams.startDate);
    if (searchParams.endDate) query.append("endDate", searchParams.endDate);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/invoices${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getInvoices Error:", error);
    return { success: false, message: error.message || "Failed to fetch invoices", data: [] };
  }
};

export const getInvoiceById = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getInvoiceById Error:", error);
    return { success: false, message: error.message || "Failed to fetch invoice details" };
  }
};

export const createInvoiceAction = async (payload) => {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("createInvoiceAction Error:", error);
    return { success: false, message: error.message || "Failed to create invoice" };
  }
};

export const updateInvoiceAction = async (id, payload) => {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/invoices/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("updateInvoiceAction Error:", error);
    return { success: false, message: error.message || "Failed to update invoice" };
  }
};

export const deleteInvoiceAction = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, message: "Unauthorized" };

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/invoices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("deleteInvoiceAction Error:", error);
    return { success: false, message: error.message || "Failed to delete invoice" };
  }
};
