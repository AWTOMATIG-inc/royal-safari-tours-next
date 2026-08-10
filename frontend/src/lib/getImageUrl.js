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
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:5000";

  return path.startsWith("/") ? `${backendUrl}${path}` : `${backendUrl}/${path}`;
};
