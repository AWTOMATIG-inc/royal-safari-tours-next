/**
 * Single authoritative backend API URL resolver.
 * Accessible across Next.js Server Actions, API Proxy, and Client Components.
 */
export const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};
