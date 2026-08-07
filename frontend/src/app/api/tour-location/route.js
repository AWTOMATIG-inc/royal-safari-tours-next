import { db_connect } from "@/database";
import { TourLocationModel } from "@/database/models/tourLocationModel";
import { fileuploader } from "@/lib/fileuploader";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function POST(request) {
  const formData = await request.formData();
  await db_connect();
  if (!formData.has("country") || !formData.has("image")) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const { image, country } = Object.fromEntries(formData);
  try {
    const filename = await fileuploader(image, "locations");
    if (!filename) {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 },
      );
    }
    const existingLocation = await TourLocationModel.findOne({
      country: country.toLowerCase(),
    });

    if (existingLocation) {
      return NextResponse.json(
        { error: "Location already exists" },
        { status: 400 },
      );
    }
    const token = request.cookies.get("token")?.value;
    const user = await verifyToken(token);
    const tourLocation = await TourLocationModel.create({
      country: country.toLowerCase(),
      image: filename,
      author: user?.id,
    });
    if (!tourLocation) {
      return NextResponse.json(
        { error: "tour location creation failed" },
        { status: 500 },
      );
    }
    const paths = ["/","/dashboard/tour-locations"];

    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(tourLocation, {
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
    const tourLocations = await TourLocationModel.find().sort({
      createdAt: -1,
    });
    return NextResponse.json(tourLocations, {
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
