"use server";

import { cookies } from "next/headers";

export const getEmploymentStatuses = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create employment status");
    }

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
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-statuses/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update employment status");
    }

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
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

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
