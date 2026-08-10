"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getBackendUrl } from "@/config/env";

export const getDesignations = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/designations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch designations from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch designations");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Designations Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch designations",
    };
  }
};

export const getDesignationById = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/designations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch designation from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch designation");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Designation Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch designation",
    };
  }
};

export const createDesignation = async (data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/designations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create designation");
    }

    revalidatePath("/dashboard/designations");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create Designation Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create designation",
    };
  }
};

export const updateDesignation = async (id, data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/designations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update designation");
    }

    revalidatePath("/dashboard/designations");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update Designation Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update designation",
    };
  }
};

export const deleteDesignation = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/designations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete designation");
    }

    revalidatePath("/dashboard/designations");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Designation Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete designation",
    };
  }
};
