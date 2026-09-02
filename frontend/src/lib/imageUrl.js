/**
 * Centralized Image URL Resolver
 * Resolves uploaded image paths, external URLs, local public assets, and fallbacks.
 */
export function getImageUrl(path, fallback = "/images/banners/home_hero.webp") {
  if (!path) return fallback;

  if (typeof path !== "string") return fallback;
  const trimmed = path.trim();
  if (!trimmed) return fallback;

  // External URLs
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Base64 data URLs
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Absolute /uploads/ or /images/ paths
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("/images/")) {
    return trimmed;
  }

  // Legacy /api/uploads/ conversion
  if (trimmed.startsWith("/api/uploads/")) {
    return trimmed.replace("/api/uploads/", "/uploads/");
  }

  // Relative upload filename
  if (trimmed.includes("/")) {
    return `/${trimmed}`;
  }

  // Default filename assumed in /uploads/media/
  return `/uploads/media/${trimmed}`;
}
