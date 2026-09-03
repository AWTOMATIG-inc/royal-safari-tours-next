/**
 * Single authoritative backend API URL resolver.
 * Strictly reads from environment variable.
 */
export const getBackendUrl = () => {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
};
