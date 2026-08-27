import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery?${searchParams.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data.data || [], { status: res.status });
  } catch (error) {
    console.error("GET /api/client-gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Upload failed" }, { status: res.status });
    }

    return NextResponse.json(data.data, { status: 201 });
  } catch (error) {
    console.error("POST /api/client-gallery error:", error);
    return NextResponse.json({ error: "Failed to upload gallery item" }, { status: 500 });
  }
}
