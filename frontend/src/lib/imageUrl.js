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
    try {
      return encodeURI(decodeURI(trimmed));
    } catch (_e) {
      return encodeURI(trimmed);
    }
  }

  // Base64 data URLs
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  let finalPath = trimmed;

  // Legacy /api/uploads/ conversion
  if (finalPath.startsWith("/api/uploads/")) {
    finalPath = finalPath.replace("/api/uploads/", "/uploads/");
  } else if (!finalPath.startsWith("/uploads/") && !finalPath.startsWith("/images/")) {
    if (finalPath.includes("/")) {
      finalPath = `/${finalPath.replace(/^\/+/, "")}`;
    } else {
      finalPath = `/uploads/media/${finalPath}`;
    }
  }

  // Ensure clean URI encoding for spaces and special characters so <Image /> never fails
  try {
    return encodeURI(decodeURI(finalPath));
  } catch (_e) {
    return encodeURI(finalPath);
  }
}
