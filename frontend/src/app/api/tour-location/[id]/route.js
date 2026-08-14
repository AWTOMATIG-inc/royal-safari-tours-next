import { db_connect } from "@/database";
import { TourLocationModel } from "@/database/models/tourLocationModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const tourLocation = await TourLocationModel.findById(id);
    if (!tourLocation) {
      return new NextResponse("Tour location not found", { status: 404 });
    }

    return NextResponse.json(tourLocation, {
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
    const deleteTourLocation = await TourLocationModel.findByIdAndDelete(id);
    if (!deleteTourLocation) {
      return new NextResponse(
        { error: "Tour location deletion failed" },
        { status: 500 },
      );
    }
    deleteFile("locations", deleteTourLocation.image);

    const paths = ["/", "/dashboard/tour-locations"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Tour location deleted successfully" },
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
  const { image, country, existingImage } = Object.fromEntries(formData);

  if (!formData.has("country") || (!formData.has("image") && !existingImage)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  let tourLocationData;
  try {
    if (image) {
      const filename = await fileuploader(image, "locations");
      tourLocationData = {
        country,
        image: filename,
      };
    } else {
      tourLocationData = {
        country,
        image: existingImage,
      };
    }

    await db_connect();
    const editTourLocation = await TourLocationModel.findByIdAndUpdate(
      id,
      tourLocationData,
    );
    if (!editTourLocation) {
      return new NextResponse(
        { error: "tour location deletion failed" },
        { status: 500 },
      );
    }
    if (image) {
      deleteFile("locations", existingImage);
    }
    const paths = ["/", "/dashboard/tour-locations"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Tour location updated successfully" },
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
