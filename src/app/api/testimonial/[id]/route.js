import { db_connect } from "@/database";
import { TestimonialModel } from "@/database/models/testimonialModel";
import { deleteFile } from "@/lib/deleteFile";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      return new NextResponse("Testimonial not found", { status: 404 });
    }
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const deleted = await TestimonialModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    deleteFile("testimonials", deleted.backgroundImage);
    deleteFile("testimonials", deleted.avatarImage);

    const paths = ["/", "/dashboard/testimonials"];
    paths.forEach((p) => revalidatePath(p));

    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const {
    name,
    country,
    feedback,
    rating,
    backgroundImage,
    avatarImage,
    existingBackgroundImage,
    existingAvatarImage,
  } = Object.fromEntries(formData);

  if (!name || !country || !feedback || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db_connect();

    let bgFilename = existingBackgroundImage;
    let avatarFilename = existingAvatarImage;

    if (backgroundImage && backgroundImage.size > 0) {
      bgFilename = await fileuploader(backgroundImage, "testimonials");
      deleteFile("testimonials", existingBackgroundImage);
    }

    if (avatarImage && avatarImage.size > 0) {
      avatarFilename = await fileuploader(avatarImage, "testimonials");
      deleteFile("testimonials", existingAvatarImage);
    }

    const updated = await TestimonialModel.findByIdAndUpdate(id, {
      name,
      country,
      feedback,
      rating: Number(rating),
      backgroundImage: bgFilename,
      avatarImage: avatarFilename,
    });

    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const paths = ["/", "/dashboard/testimonials"];
    paths.forEach((p) => revalidatePath(p));

    return NextResponse.json(
      { message: "Testimonial updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}
