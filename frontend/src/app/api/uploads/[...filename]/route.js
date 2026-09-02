import fs from "fs";
import mime from "mime-types";
import { NextResponse } from "next/server";
import path from "path";

/**
 * Case-insensitive file finder for cross-platform & Linux compatibility
 */
function getExistingFileCaseInsensitive(directory, filename) {
  if (!fs.existsSync(directory)) return null;
  const exactPath = path.join(directory, filename);
  if (fs.existsSync(exactPath)) return exactPath;

  const targetLower = filename.toLowerCase();
  try {
    const files = fs.readdirSync(directory);
    const found = files.find((f) => f.toLowerCase() === targetLower);
    if (found) {
      return path.join(directory, found);
    }
  } catch (err) {
    // Ignore error
  }
  return null;
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const filenameArr = params?.filename || [];

    if (!filenameArr || filenameArr.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const subfolder = filenameArr[0];
    const imagefile = filenameArr.slice(1).join("/");

    // Comprehensive search paths across frontend, backend, and root uploads directories
    const cwd = process.cwd();
    const candidatePaths = [
      path.join(cwd, "uploads", subfolder, imagefile),
      path.join(cwd, "frontend", "uploads", subfolder, imagefile),
      path.join(cwd, "backend", "uploads", subfolder, imagefile),
      path.resolve(cwd, "..", "uploads", subfolder, imagefile),
      path.resolve(cwd, "..", "frontend", "uploads", subfolder, imagefile),
      path.resolve(cwd, "..", "backend", "uploads", subfolder, imagefile),
    ];

    let foundPath = null;
    for (const cand of candidatePaths) {
      if (fs.existsSync(cand)) {
        foundPath = cand;
        break;
      }
    }

    // Fallback selection if exact uploaded file does not exist on disk
    if (!foundPath) {
      const nameLower = (imagefile || "").toLowerCase();
      const experiencesDir = path.join(cwd, "public", "images", "experiences");
      const bannersDir = path.join(cwd, "public", "images", "banners");
      const placeholdersDir = path.join(cwd, "public", "images", "placeholders");

      if (subfolder === "locations") {
        if (nameLower.includes("thailand")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "rope_swing.webp");
        } else if (nameLower.includes("nepal")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "climbing.webp");
        } else if (nameLower.includes("srilanka") || nameLower.includes("sri-lanka")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "horseback_riding.webp");
        } else if (nameLower.includes("maldives")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "boating.webp");
        } else if (nameLower.includes("china")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "hiking.webp");
        } else if (nameLower.includes("brazil")) {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "horse_riding.webp") || getExistingFileCaseInsensitive(bannersDir, "camping.webp");
        } else {
          foundPath = getExistingFileCaseInsensitive(experiencesDir, "camping.webp") || getExistingFileCaseInsensitive(experiencesDir, "hiking.webp");
        }
      } else if (subfolder === "tour-packages") {
        const hash = imagefile ? imagefile.charCodeAt(0) : 0;
        const candidates = ["hiking.webp", "camping.webp", "horse_riding.webp", "boating.webp", "cycling.webp", "kayaking.webp", "bamboo_rafting.webp", "canyoning.webp"];
        const selected = candidates[hash % candidates.length];
        foundPath = getExistingFileCaseInsensitive(experiencesDir, selected);
      } else if (subfolder === "testimonials" || subfolder === "avatars" || subfolder === "user") {
        foundPath = getExistingFileCaseInsensitive(placeholdersDir, "avatar_placeholder.jpg");
      } else if (subfolder === "gallery" || subfolder === "photos") {
        const hash = imagefile ? imagefile.charCodeAt(0) : 0;
        const slides = ["home_hero.webp", "about_hero.webp", "about_preview.webp", "travel_inspiration.webp", "memories_bg.webp", "client_gallery_hero.webp"];
        const selected = slides[hash % slides.length];
        foundPath = getExistingFileCaseInsensitive(bannersDir, selected);
      }

      // Ultimate safe fallback guarantee
      if (!foundPath) {
        foundPath = getExistingFileCaseInsensitive(bannersDir, "home_hero.webp") ||
                    getExistingFileCaseInsensitive(experiencesDir, "hiking.webp");
      }
    }

    if (!foundPath || !fs.existsSync(foundPath)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);
    const contentType = mime.lookup(foundPath) || "image/webp";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading upload file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
