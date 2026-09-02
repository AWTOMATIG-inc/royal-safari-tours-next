"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getAuthHeaders = (extraHeaders = {}) => {
  const nextCookies = cookies();
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
    const res = await fetch(`${BACKEND_URL}/api/v1/media?folderPath=${encodeURIComponent(folderPath)}`, {
      headers: getAuthHeaders(),
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
    const res = await fetch(`${BACKEND_URL}/api/v1/media/folder`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
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
    const res = await fetch(`${BACKEND_URL}/api/v1/media/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
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
    const res = await fetch(`${BACKEND_URL}/api/v1/media/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete media item");
    return { success: true };
  } catch (error) {
    console.error("Delete Media Item Error:", error);
    return { success: false, message: error.message || "Failed to delete item" };
  }
};
