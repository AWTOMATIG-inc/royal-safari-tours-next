import { db_connect } from "@/database";
import { TestimonialModel } from "@/database/models/testimonialModel";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const { name, country, feedback, rating, backgroundImage, avatarImage } =
    Object.fromEntries(formData);

  if (!name || !country || !feedback || !rating || !backgroundImage || !avatarImage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db_connect();
    const bgFilename = await fileuploader(backgroundImage, "testimonials");
    const avatarFilename = await fileuploader(avatarImage, "testimonials");

    if (!bgFilename || !avatarFilename) {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }

    const testimonial = await TestimonialModel.create({
      name,
      country,
      feedback,
      rating: Number(rating),
      backgroundImage: bgFilename,
      avatarImage: avatarFilename,
    });

    const paths = ["/", "/dashboard/testimonials"];
    paths.forEach((p) => revalidatePath(p));

    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await db_connect();
    const testimonials = await TestimonialModel.find().sort({ createdAt: -1 });
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}
