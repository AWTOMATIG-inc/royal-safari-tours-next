import { db_connect } from "@/database";
import { GalleryImageModel } from "@/database/models/galleryImageModel";
import { fileuploader } from "@/lib/fileuploader";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    await db_connect();
    const filename = await fileuploader(file, "gallery");
    if (!filename) {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }
    const image = await GalleryImageModel.create({ filename });
    revalidatePath("/");
    revalidatePath("/dashboard/gallery");
    return NextResponse.json(image, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await db_connect();
    const images = await GalleryImageModel.find().sort({ createdAt: -1 });
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
