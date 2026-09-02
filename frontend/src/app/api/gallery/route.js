import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data.data || [], { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let res;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // Forward auth and cookies without setting Content-Type so fetch calculates multipart boundary
      const headers = getForwardHeaders(request);
      res = await fetch(`${BACKEND_URL}/api/v1/gallery`, {
        method: "POST",
        headers,
        body: formData,
      });
    } else {
      const body = await request.json();
      const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
      res = await fetch(`${BACKEND_URL}/api/v1/gallery`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
