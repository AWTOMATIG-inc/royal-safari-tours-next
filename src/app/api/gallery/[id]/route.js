import { db_connect } from "@/database";
import { GalleryImageModel } from "@/database/models/galleryImageModel";
import { deleteFile } from "@/lib/deleteFile";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    await db_connect();
    const deleted = await GalleryImageModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    deleteFile("gallery", deleted.filename);
    revalidatePath("/");
    revalidatePath("/dashboard/gallery");
    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
