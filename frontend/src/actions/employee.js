"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const getEmployees = async (page = 1, filters = {}) => {
  try {
    const limit = filters.limit || 10;
    const currentPage = Math.max(1, Number(page) || 1);

    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(limit),
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.departmentId) params.append("departmentId", filters.departmentId);
    if (filters.designationId) params.append("designationId", filters.designationId);
    if (filters.employmentTypeId) params.append("employmentTypeId", filters.employmentTypeId);
    if (filters.employmentStatusId) params.append("employmentStatusId", filters.employmentStatusId);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const res = await fetch(`${backendUrl}/api/v1/employees?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employees from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employees");
    }

    return {
      success: true,
      data: result.data,
      pagination: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  } catch (error) {
    console.error("Get Employees Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employees",
    };
  }
};

export const getEmployeeById = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employee from backend");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch employee");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get Employee Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch employee",
    };
  }
};

export const createEmployee = async (formData) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create employee");
    }

    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Create Employee Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create employee",
    };
  }
};

export const updateEmployee = async (id, formData) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update employee");
    }

    revalidatePath("/dashboard/employees");
    revalidatePath(`/dashboard/employees/${id}`);
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Update Employee Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update employee",
    };
  }
};

export const deleteEmployee = async (id) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete employee");
    }

    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/hrm");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete employee",
    };
  }
};

export const uploadEmployeeDocument = async (employeeId, formData) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees/${employeeId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to upload document");
    }

    revalidatePath(`/dashboard/employees/${employeeId}`);
    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Upload Employee Document Error:", error);
    return {
      success: false,
      message: error.message || "Failed to upload document",
    };
  }
};

export const deleteEmployeeDocument = async (docId, employeeId) => {
  try {
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/v1/employees/documents/${docId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete document");
    }

    if (employeeId) {
      revalidatePath(`/dashboard/employees/${employeeId}`);
    }
    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Delete Employee Document Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete document",
    };
  }
};
