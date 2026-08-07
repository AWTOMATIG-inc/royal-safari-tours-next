import { db_connect } from "@/database";
import { TourLocationModel } from "@/database/models/tourLocationModel";
import { TourPackageModel } from "@/database/models/tourPackageModel";
import { fileuploader } from "@/lib/fileuploader";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function POST(request) {
  const formData = await request.formData();
  await db_connect();
  if (
    !formData.has("title") ||
    !formData.has("description") ||
    !formData.has("additionalInfo") ||
    !formData.has("price") ||
    !formData.has("rating") ||
    !formData.has("location") ||
    !formData.has("duration") ||
    !formData.has("shortDescription") ||
    !formData.has("image")
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const token = request.cookies.get("token")?.value;
  const user = await verifyToken(token);
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
  } = Object.fromEntries(formData);

  try {
    const filename = await fileuploader(image, "tour-packages");
    if (!filename) {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 },
      );
    }

    const tourPackage = await TourPackageModel.create({
      title,
      description,
      additionalInfo,
      price,
      rating,
      location,
      duration,
      shortDescription,
      image: filename,
      author: user?.id,
    });
    if (!tourPackage) {
      return NextResponse.json(
        { error: "tour package creation failed" },
        { status: 500 },
      );
    }
    await TourLocationModel.findOneAndUpdate(
      { country: location.toLowerCase() },
      { $push: { tourPackages: tourPackage._id } },
    );

    const paths = ["/","/dashboard/tour-packages"];

    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(tourPackage, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    await db_connect();
    const tourPackages = await TourPackageModel.find().sort({ createdAt: -1 });
    return NextResponse.json(tourPackages, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
