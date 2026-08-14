import fs from "fs";
import mime from "mime-types";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req, context) {
  const { filename } = await context.params;
  const subfolder = filename[0];
  const imagefile = filename[1];
  let filePath = path.join(process.cwd(), "uploads", subfolder, imagefile);

  if (!fs.existsSync(filePath)) {
    const nameLower = imagefile.toLowerCase();
    if (subfolder === "locations") {
      if (nameLower.includes("thailand")) {
        filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", "swing.webp");
      } else if (nameLower.includes("nepal")) {
        filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", "climbing.webp");
      } else if (nameLower.includes("srilanka")) {
        filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", "riding.webp");
      } else if (nameLower.includes("maldives")) {
        filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", "Boating.webp");
      } else if (nameLower.includes("china")) {
        filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", "hiking.webp");
      } else {
        filePath = path.join(process.cwd(), "public", "images", "banners", "camping.webp");
      }
    } else if (subfolder === "tour-packages") {
      // Alternate fallback selections for diverse tour package lists
      const hash = imagefile.charCodeAt(0) || 0;
      const collections = [
        "hiking.webp", "camping.webp", "riding.webp", 
        "Boating.webp", "cycling.webp", "kayaking.webp"
      ];
      const selected = collections[hash % collections.length];
      filePath = path.join(process.cwd(), "public", "images", "adventure", "collections", selected);
    } else if (subfolder === "testimonials") {
      filePath = path.join(process.cwd(), "public", "images", "avatar.jpg");
    } else if (subfolder === "gallery") {
      const hash = imagefile.charCodeAt(0) || 0;
      const slides = ["banner2.webp", "camping.webp", "banner1.webp", "about-banner.webp"];
      const selected = slides[hash % slides.length];
      filePath = path.join(process.cwd(), "public", "images", "banners", selected);
    } else {
      filePath = path.join(process.cwd(), "public", "images", "banners", "banner1.webp");
    }
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
