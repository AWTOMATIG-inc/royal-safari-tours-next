"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getBackendUrl } from "@/config/env";

export const getDepartments = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/departments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch departments from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch departments");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Departments Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch departments",
    };
  }
};

export const getDepartmentById = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch department from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch department");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Department Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch department",
    };
  }
};

export const createDepartment = async (data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create department");
    }

    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create Department Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create department",
    };
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/departments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update department");
    }

    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update Department Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update department",
    };
  }
};

export const deleteDepartment = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/departments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete department");
    }

    revalidatePath("/dashboard/departments");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Department Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete department",
    };
  }
};
