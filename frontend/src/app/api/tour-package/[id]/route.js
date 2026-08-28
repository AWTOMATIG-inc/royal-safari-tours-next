import { db_connect } from "@/database";
import { TourPackageModel } from "@/database/models/tourPackageModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(_request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const tourPackage = await TourPackageModel.findById(id);
    if (!tourPackage) {
      return NextResponse.json({ error: "Tour package not found" }, { status: 404 });
    }

    return NextResponse.json(tourPackage, { status: 200 });
  } catch (error) {
    console.error("GET /api/tour-package/[id] error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const deleteTourPackage = await TourPackageModel.findByIdAndDelete(id);
    if (!deleteTourPackage) {
      return NextResponse.json({ error: "Tour package deletion failed" }, { status: 404 });
    }

    if (deleteTourPackage.image && !deleteTourPackage.image.startsWith("http") && !deleteTourPackage.image.startsWith("/")) {
      deleteFile("tour-packages", deleteTourPackage.image);
    }

    const paths = ["/", "/adventure", "/dashboard/tour-packages"];
    paths.forEach((p) => revalidatePath(p));

    return NextResponse.json({ message: "Tour package deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/tour-package/[id] error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const existing = await TourPackageModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Tour package not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    let bodyData = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const imageFile = formData.get("image");
      let featuredFilename = existing.image;

      if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        featuredFilename = await fileuploader(imageFile, "tour-packages");
        if (existing.image && !existing.image.startsWith("http") && !existing.image.startsWith("/")) {
          deleteFile("tour-packages", existing.image);
        }
      } else if (formData.get("existingImage")) {
        featuredFilename = formData.get("existingImage");
      }

      bodyData = {
        title: formData.get("title") || existing.title,
        location: formData.get("location") || existing.location,
        price: formData.has("price") ? Number(formData.get("price")) : existing.price,
        discountPrice: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : null,
        hotelRating: formData.has("hotelRating") ? Number(formData.get("hotelRating")) : (formData.has("rating") ? Number(formData.get("rating")) : existing.hotelRating),
        duration: formData.get("duration") || existing.duration,
        description: formData.get("description") || existing.description,
        additionalInfo: formData.get("additionalInfo") !== null ? formData.get("additionalInfo") : existing.additionalInfo,
        image: featuredFilename,
        featuredImage: featuredFilename,
        transportation: formData.get("transportation") ? JSON.parse(formData.get("transportation")) : existing.transportation,
        itinerary: formData.get("itinerary") ? JSON.parse(formData.get("itinerary")) : existing.itinerary,
        inclusions: formData.get("inclusions") ? JSON.parse(formData.get("inclusions")) : existing.inclusions,
        exclusions: formData.get("exclusions") ? JSON.parse(formData.get("exclusions")) : existing.exclusions,
        hotels: formData.get("hotels") ? JSON.parse(formData.get("hotels")) : existing.hotels,
        galleryImages: formData.get("galleryImages") ? JSON.parse(formData.get("galleryImages")) : existing.galleryImages,
      };
    } else {
      const json = await request.json();
      bodyData = {
        title: json.title ?? existing.title,
        location: json.location ?? existing.location,
        price: json.price !== undefined ? Number(json.price) : existing.price,
        discountPrice: json.discountPrice !== undefined ? (json.discountPrice ? Number(json.discountPrice) : null) : existing.discountPrice,
        hotelRating: json.hotelRating !== undefined ? Number(json.hotelRating) : (json.rating !== undefined ? Number(json.rating) : existing.hotelRating),
        duration: json.duration ?? existing.duration,
        description: json.description ?? existing.description,
        additionalInfo: json.additionalInfo ?? existing.additionalInfo,
        image: json.image || json.featuredImage || existing.image,
        featuredImage: json.featuredImage || json.image || existing.featuredImage,
        transportation: Array.isArray(json.transportation) ? json.transportation : existing.transportation,
        itinerary: Array.isArray(json.itinerary) ? json.itinerary : existing.itinerary,
        inclusions: Array.isArray(json.inclusions) ? json.inclusions : existing.inclusions,
        exclusions: Array.isArray(json.exclusions) ? json.exclusions : existing.exclusions,
        hotels: Array.isArray(json.hotels) ? json.hotels : existing.hotels,
        galleryImages: Array.isArray(json.galleryImages) ? json.galleryImages : existing.galleryImages,
      };
    }

    const updated = await TourPackageModel.findByIdAndUpdate(id, bodyData, { new: true });

    revalidatePath("/");
    revalidatePath("/adventure");
    revalidatePath(`/packages/${updated.slug}`);
    revalidatePath("/dashboard/tour-packages");

    return NextResponse.json({ message: "Tour package updated successfully", data: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/tour-package/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update tour package" }, { status: 500 });
  }
}
