"use server";

import { cookies } from "next/headers";

export const getEmploymentTypes = async () => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employment types from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employment types");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Employment Types Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employment types",
    };
  }
};

export const getEmploymentTypeById = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-types/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employment type from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employment type");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Employment Type Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employment type",
    };
  }
};

export const createEmploymentType = async (data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-types`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create employment type");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create Employment Type Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create employment type",
    };
  }
};

export const updateEmploymentType = async (id, data) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-types/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update employment type");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update Employment Type Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update employment type",
    };
  }
};

export const deleteEmploymentType = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employment-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete employment type");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Employment Type Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete employment type",
    };
  }
};
