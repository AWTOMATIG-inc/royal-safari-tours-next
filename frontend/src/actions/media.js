"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/config/env";

const getAuthHeaders = async (extraHeaders = {}) => {
  const nextCookies = await cookies();
  const token = nextCookies.get("token")?.value || nextCookies.get("accessToken")?.value;
  const headers = { ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["Cookie"] = `token=${token}; accessToken=${token}`;
  }
  return headers;
};

export const getMediaByFolderPath = async (folderPath = "") => {
  try {
    const backendUrl = getBackendUrl();
    const headers = await getAuthHeaders();
    const res = await fetch(`${backendUrl}/api/v1/media?folderPath=${encodeURIComponent(folderPath)}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch media items");
    const result = await res.json();
    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("Get Media by Folder Path Error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch media library items",
    };
  }
};

export const createMediaFolder = async (folderName, parentFolderPath = "") => {
  try {
    const backendUrl = getBackendUrl();
    const headers = await getAuthHeaders({ "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/media/folder`, {
      method: "POST",
      headers,
      body: JSON.stringify({ folderName, parentFolderPath }),
    });
    if (!res.ok) throw new Error("Failed to create folder");
    const result = await res.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Create Media Folder Error:", error);
    return { success: false, message: error.message || "Failed to create folder" };
  }
};

export const renameMediaItem = async (id, name) => {
  try {
    const backendUrl = getBackendUrl();
    const headers = await getAuthHeaders({ "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/media/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to rename media item");
    const result = await res.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Rename Media Item Error:", error);
    return { success: false, message: error.message || "Failed to rename item" };
  }
};

export const deleteMediaItem = async (id) => {
  try {
    const backendUrl = getBackendUrl();
    const headers = await getAuthHeaders();
    const res = await fetch(`${backendUrl}/api/v1/media/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete media item");
    return { success: true };
  } catch (error) {
    console.error("Delete Media Item Error:", error);
    return { success: false, message: error.message || "Failed to delete item" };
  }
};
