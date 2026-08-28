import { db_connect } from "@/database";
import { MediaModel } from "@/database/models/mediaModel";
import { fileuploader } from "@/lib/fileuploader";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get("folderPath") || "";

    await db_connect();
    const items = await MediaModel.find({ folderPath })
      .sort({ type: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const folderPath = formData.get("folderPath") || "";
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    await db_connect();
    const uploadedDocs = [];

    for (const file of files) {
      if (typeof file === "object" && file.size > 0) {
        const filename = await fileuploader(file, "media");
        if (filename) {
          const url = `/api/uploads/media/${filename}`;
          const mediaDoc = await MediaModel.create({
            name: file.name || filename,
            type: "file",
            url,
            folderPath,
            size: file.size,
            mimeType: file.type,
          });
          uploadedDocs.push(mediaDoc);
        }
      }
    }

    return NextResponse.json({ success: true, data: uploadedDocs }, { status: 201 });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}
