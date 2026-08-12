"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

const getAuthToken = async () => {
  const nextCookies = await cookies();
  return nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;
};

export const getLeaveTypes = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leave-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch leave types" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Leave Types Error:", error);
    return { success: false, message: error.message || "Failed to fetch leave types" };
  }
};

export const createLeaveType = async (payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leave-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to create leave type" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Create Leave Type Error:", error);
    return { success: false, message: error.message || "Failed to create leave type" };
  }
};

export const updateLeaveType = async (id, payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leave-types/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update leave type" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update Leave Type Error:", error);
    return { success: false, message: error.message || "Failed to update leave type" };
  }
};

export const deleteLeaveType = async (id) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leave-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to delete leave type" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Delete Leave Type Error:", error);
    return { success: false, message: error.message || "Failed to delete leave type" };
  }
};

export const getMyLeaveBalances = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leaves/balances/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch leave balances" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get My Leave Balances Error:", error);
    return { success: false, message: error.message || "Failed to fetch leave balances" };
  }
};

export const getMyLeaveApplications = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leaves/my-applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch my leave applications" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get My Leave Applications Error:", error);
    return { success: false, message: error.message || "Failed to fetch my leave applications" };
  }
};

export const applyLeave = async (payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leaves/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to submit leave application" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Apply Leave Error:", error);
    return { success: false, message: error.message || "Failed to submit leave application" };
  }
};

export const getAllLeaveApplications = async (searchParams = {}) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams();
    if (searchParams.status) query.append("status", searchParams.status);
    if (searchParams.departmentId) query.append("departmentId", searchParams.departmentId);
    if (searchParams.search) query.append("search", searchParams.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/leaves/applications${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch leave applications" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get All Leave Applications Error:", error);
    return { success: false, message: error.message || "Failed to fetch leave applications" };
  }
};

export const updateLeaveApplicationStatus = async (id, payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leaves/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update leave application status" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update Leave Application Status Error:", error);
    return { success: false, message: error.message || "Failed to update leave application status" };
  }
};

export const updateEmployeeLeaveBalance = async (balanceId, payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/leaves/balances/${balanceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update leave balance" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update Employee Leave Balance Error:", error);
    return { success: false, message: error.message || "Failed to update leave balance" };
  }
};
