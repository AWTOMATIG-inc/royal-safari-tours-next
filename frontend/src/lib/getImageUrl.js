import { getBackendUrl } from "@/config/env";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const backendUrl = getBackendUrl();
  return path.startsWith("/") ? `${backendUrl}${path}` : `${backendUrl}/${path}`;
};
