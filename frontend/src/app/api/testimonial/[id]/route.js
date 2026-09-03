import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/testimonials/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    let bodyPayload;

    if (contentType.includes("application/json")) {
      bodyPayload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      bodyPayload = {
        name: formData.get("name"),
        country: formData.get("country"),
        feedback: formData.get("feedback"),
        rating: Number(formData.get("rating")) || 5,
        backgroundImage: typeof formData.get("backgroundImage") === "string" ? formData.get("backgroundImage") : formData.get("existingBackgroundImage") || null,
        avatarImage: typeof formData.get("avatarImage") === "string" ? formData.get("avatarImage") : formData.get("existingAvatarImage") || null,
      };
    } else {
      bodyPayload = await request.json();
    }

    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/testimonials/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(bodyPayload),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/testimonials/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
