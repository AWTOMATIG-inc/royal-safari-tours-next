import { db_connect } from "@/database";
import { TourPackageModel } from "@/database/models/tourPackageModel";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await db_connect();
    const contentType = request.headers.get("content-type") || "";

    let bodyData = {};
    let featuredFilename = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const imageFile = formData.get("image");
      if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        featuredFilename = await fileuploader(imageFile, "tour-packages");
      } else if (formData.get("imagePath")) {
        featuredFilename = formData.get("imagePath");
      }

      bodyData = {
        title: formData.get("title") || "",
        location: formData.get("location") || "",
        price: Number(formData.get("price")) || 0,
        discountPrice: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : null,
        hotelRating: Number(formData.get("hotelRating") || formData.get("rating")) || 3,
        duration: formData.get("duration") || "",
        description: formData.get("description") || "",
        additionalInfo: formData.get("additionalInfo") || "",
        image: featuredFilename || formData.get("imagePath") || "/images/placeholder.jpg",
        featuredImage: featuredFilename || formData.get("imagePath") || "/images/placeholder.jpg",
        transportation: formData.get("transportation") ? JSON.parse(formData.get("transportation")) : [],
        itinerary: formData.get("itinerary") ? JSON.parse(formData.get("itinerary")) : [],
        inclusions: formData.get("inclusions") ? JSON.parse(formData.get("inclusions")) : [],
        exclusions: formData.get("exclusions") ? JSON.parse(formData.get("exclusions")) : [],
        hotels: formData.get("hotels") ? JSON.parse(formData.get("hotels")) : [],
        galleryImages: formData.get("galleryImages") ? JSON.parse(formData.get("galleryImages")) : [],
      };
    } else {
      const json = await request.json();
      bodyData = {
        title: json.title,
        location: json.location,
        price: Number(json.price) || 0,
        discountPrice: json.discountPrice ? Number(json.discountPrice) : null,
        hotelRating: Number(json.hotelRating || json.rating) || 3,
        duration: json.duration,
        description: json.description,
        additionalInfo: json.additionalInfo || "",
        image: json.image || json.featuredImage || "/images/placeholder.jpg",
        featuredImage: json.featuredImage || json.image || "/images/placeholder.jpg",
        transportation: Array.isArray(json.transportation) ? json.transportation : [],
        itinerary: Array.isArray(json.itinerary) ? json.itinerary : [],
        inclusions: Array.isArray(json.inclusions) ? json.inclusions : [],
        exclusions: Array.isArray(json.exclusions) ? json.exclusions : [],
        hotels: Array.isArray(json.hotels) ? json.hotels : [],
        galleryImages: Array.isArray(json.galleryImages) ? json.galleryImages : [],
      };
    }

    if (!bodyData.title || !bodyData.location || !bodyData.description) {
      return NextResponse.json({ error: "Title, location, and description are required" }, { status: 400 });
    }

    const tourPackage = await TourPackageModel.create(bodyData);

    revalidatePath("/");
    revalidatePath("/adventure");
    revalidatePath("/dashboard/tour-packages");

    return NextResponse.json(tourPackage, { status: 201 });
  } catch (error) {
    console.error("POST /api/tour-package error:", error);
    return NextResponse.json({ error: error.message || "Failed to create tour package" }, { status: 500 });
  }
}
