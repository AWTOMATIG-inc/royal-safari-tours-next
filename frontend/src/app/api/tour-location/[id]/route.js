import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tour location" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    let bodyPayload;

    if (contentType.includes("application/json")) {
      bodyPayload = await request.json();
    } else {
      const formData = await request.formData();
      const country = formData.get("country");
      const description = formData.get("description");
      const existingImage = formData.get("existingImage");
      const imageFile = formData.get("image");

      bodyPayload = {
        country,
        description: description || "",
        image: typeof imageFile === "string" ? imageFile : existingImage || "",
      };
    }

    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(bodyPayload),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to update tour location" }, { status: res.status });
    }
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update tour location" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/tour-locations/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete tour location" }, { status: 500 });
  }
}
