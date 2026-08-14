"use server";

import { cookies } from "next/headers";

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

// PUBLIC Actions
export const getPublicJobs = async (searchParams = {}) => {
  try {
    const backendUrl = getBackendUrl();
    const query = new URLSearchParams();
    if (searchParams.search) query.append("search", searchParams.search);
    if (searchParams.location) query.append("location", searchParams.location);
    if (searchParams.workMode) query.append("workMode", searchParams.workMode);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/jobs/public${queryString}`, {
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch job postings" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Public Jobs Error:", error);
    return { success: false, message: error.message || "Failed to fetch job postings" };
  }
};

export const getPublicJobBySlug = async (slug) => {
  try {
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/public/${slug}`, {
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Job position not found" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Public Job By Slug Error:", error);
    return { success: false, message: error.message || "Job position not found" };
  }
};

export const submitJobApplication = async (slug, formData) => {
  try {
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/public/${slug}/apply`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to submit job application" };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    console.error("Submit Job Application Error:", error);
    return { success: false, message: error.message || "Failed to submit job application" };
  }
};

// ADMIN Actions
export const getAdminJobs = async () => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch admin job postings" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);
    return { success: false, message: error.message || "Failed to fetch admin job postings" };
  }
};

export const createJobPost = async (payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to create job post" };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    console.error("Create Job Post Error:", error);
    return { success: false, message: error.message || "Failed to create job post" };
  }
};

export const updateJobPost = async (id, payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update job post" };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    console.error("Update Job Post Error:", error);
    return { success: false, message: error.message || "Failed to update job post" };
  }
};

export const deleteJobPost = async (id) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to delete job post" };
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Delete Job Post Error:", error);
    return { success: false, message: error.message || "Failed to delete job post" };
  }
};

export const getAdminJobApplications = async (searchParams = {}) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const query = new URLSearchParams();
    if (searchParams.jobPostId) query.append("jobPostId", searchParams.jobPostId);
    if (searchParams.status) query.append("status", searchParams.status);
    if (searchParams.search) query.append("search", searchParams.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin/applications${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to fetch job applications" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get Admin Job Applications Error:", error);
    return { success: false, message: error.message || "Failed to fetch job applications" };
  }
};

export const updateJobApplicationStatus = async (id, payload) => {
  try {
    const token = await getAuthToken();
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/api/v1/jobs/admin/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.error || "Failed to update application status" };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    console.error("Update Job Application Status Error:", error);
    return { success: false, message: error.message || "Failed to update application status" };
  }
};
