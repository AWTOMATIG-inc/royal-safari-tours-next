"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getBackendUrl } from "@/config/env";

export const getEmploymentStatuses = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employment statuses from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employment statuses");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Employment Statuses Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employment statuses",
    };
  }
};

export const getEmploymentStatusById = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employment status from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employment status");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Employment Status Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employment status",
    };
  }
};

export const createEmploymentStatus = async (data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create employment status");
    }

    revalidatePath("/dashboard/employment-statuses");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create Employment Status Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create employment status",
    };
  }
};

export const updateEmploymentStatus = async (id, data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update employment status");
    }

    revalidatePath("/dashboard/employment-statuses");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update Employment Status Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update employment status",
    };
  }
};

export const deleteEmploymentStatus = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete employment status");
    }

    revalidatePath("/dashboard/employment-statuses");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Employment Status Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete employment status",
    };
  }
};
