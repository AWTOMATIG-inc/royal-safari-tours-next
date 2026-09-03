import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request) {
  try {
    const backendUrl = getBackendUrl();
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/gallery?${searchParams.toString()}`, {
      headers,
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
    const backendUrl = getBackendUrl();
    const contentType = request.headers.get("content-type") || "";
    let res;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const headers = getForwardHeaders(request);
      res = await fetch(`${backendUrl}/api/v1/gallery`, {
        method: "POST",
        headers,
        body: formData,
      });
    } else {
      const body = await request.json();
      const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
      res = await fetch(`${backendUrl}/api/v1/gallery`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Upload failed" }, { status: res.status });
    }

    return NextResponse.json(data.data || data, { status: 201 });
  } catch (error) {
    console.error("POST /api/client-gallery error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload gallery item" }, { status: 500 });
  }
}
