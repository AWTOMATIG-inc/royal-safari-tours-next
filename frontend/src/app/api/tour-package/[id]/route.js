import { db_connect } from "@/database";
import { TourPackageModel } from "@/database/models/tourPackageModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const tourPackage = await TourPackageModel.findById(id);
    if (!tourPackage) {
      return new NextResponse("Tour package not found", { status: 404 });
    }

    return NextResponse.json(tourPackage, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("something went wrong", { status: 500 });
  }
}
export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const deleteTourPackage = await TourPackageModel.findByIdAndDelete(id);
    if (!deleteTourPackage) {
      return new NextResponse(
        { error: "Tour package deletion failed" },
        { status: 500 },
      );
    }
    deleteFile("tour-packages", deleteTourPackage.image);

   const paths = ["/","/dashboard/tour-packages"]
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Tour package deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const {
    image,
    title,
    description,
    additionalInfo,
    price,
    rating,
    location,
    duration,
    shortDescription,
    existingImage,
  } = Object.fromEntries(formData);

  if (
    !formData.has("title") ||
    !formData.has("description") ||
    !formData.has("additionalInfo") ||
    !formData.has("price") ||
    !formData.has("rating") ||
    !formData.has("location") ||
    !formData.has("duration") ||
    !formData.has("shortDescription") ||
    (!formData.has("image") && !existingImage)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  let tourPackageData;
  try {
    if (image) {
      const filename = await fileuploader(image, "tour-packages");
      tourPackageData = {
        title,
        description,
        additionalInfo,
        price,
        rating,
        location,
        duration,
        shortDescription,
        image: filename,
      };
    } else {
      tourPackageData = {
        title,
        description,
        additionalInfo,
        price,
        rating,
        location,
        duration,
        shortDescription,
        image: existingImage,
      };
    }

    await db_connect();
    const editTourPackage = await TourPackageModel.findByIdAndUpdate(
      id,
      tourPackageData,
    );
    if (!editTourPackage) {
      return new NextResponse(
        { error: "tour package update failed" },
        { status: 500 },
      );
    }
    if (image) {
      deleteFile("tour-packages", existingImage);
    }
    const paths = ["/","/dashboard/tour-packages"]
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Tour package updated successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
