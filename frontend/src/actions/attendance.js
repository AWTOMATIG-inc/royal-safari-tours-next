"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

const getAuthToken = async () => {
  const nextCookies = await cookies();
  return nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;
};

export const checkInAttendance = async (payload = {}) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/attendance/check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to check in" };
    }

    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error("Check-In Error:", error);
    return { success: false, message: error.message || "Failed to check in" };
  }
};

export const checkOutAttendance = async (payload = {}) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/attendance/check-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to check out" };
    }

    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error("Check-Out Error:", error);
    return { success: false, message: error.message || "Failed to check out" };
  }
};

export const getTodayAttendanceStatus = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/attendance/status/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch today's attendance status" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Today Attendance Status Error:", error);
    return { success: false, message: error.message || "Failed to fetch today's attendance status" };
  }
};

export const getMyAttendanceHistory = async (month, year) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams();
    if (month !== undefined && month !== null) query.append("month", month);
    if (year !== undefined && year !== null) query.append("year", year);
    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/attendance/my-history${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch attendance history" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get My Attendance History Error:", error);
    return { success: false, message: error.message || "Failed to fetch attendance history" };
  }
};

export const getAdminTodayAttendance = async (dateStr) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const queryString = dateStr ? `?date=${encodeURIComponent(dateStr)}` : "";

    const res = await fetch(`${backendUrl}/api/v1/attendance/admin/today${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch daily attendance summary" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Admin Today Attendance Error:", error);
    return { success: false, message: error.message || "Failed to fetch daily attendance summary" };
  }
};

export const getAdminAttendanceReport = async (searchParams = {}) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams();
    if (searchParams.startDate) query.append("startDate", searchParams.startDate);
    if (searchParams.endDate) query.append("endDate", searchParams.endDate);
    if (searchParams.departmentId) query.append("departmentId", searchParams.departmentId);
    if (searchParams.status) query.append("status", searchParams.status);
    if (searchParams.search) query.append("search", searchParams.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/attendance/admin/report${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch attendance report" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Admin Attendance Report Error:", error);
    return { success: false, message: error.message || "Failed to fetch attendance report" };
  }
};

export const getAdminMonthlySummary = async (month, year, departmentId, search) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams();
    if (month !== undefined && month !== null) query.append("month", month);
    if (year !== undefined && year !== null) query.append("year", year);
    if (departmentId) query.append("departmentId", departmentId);
    if (search) query.append("search", search);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/attendance/admin/monthly-summary${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch monthly attendance summary" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Admin Monthly Summary Error:", error);
    return { success: false, message: error.message || "Failed to fetch monthly attendance summary" };
  }
};

export const getEmployeeMonthlyDetailedLog = async (employeeId, month, year) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams({ employeeId });
    if (month !== undefined && month !== null) query.append("month", month);
    if (year !== undefined && year !== null) query.append("year", year);

    const res = await fetch(`${backendUrl}/api/v1/attendance/admin/employee-monthly-log?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch employee detailed log" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Employee Monthly Detailed Log Error:", error);
    return { success: false, message: error.message || "Failed to fetch employee detailed log" };
  }
};

export const getAttendancePolicy = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/attendance/policy`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch attendance policy" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Attendance Policy Error:", error);
    return { success: false, message: error.message || "Failed to fetch attendance policy" };
  }
};

export const updateAttendancePolicy = async (payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/attendance/policy`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update attendance policy" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update Attendance Policy Error:", error);
    return { success: false, message: error.message || "Failed to update attendance policy" };
  }
};
