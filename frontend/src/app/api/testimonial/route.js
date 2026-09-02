import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${BACKEND_URL}/api/v1/testimonials?${queryString}`
      : `${BACKEND_URL}/api/v1/testimonials`;

    const headers = getForwardHeaders(request);
    const res = await fetch(url, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let bodyPayload;

    if (contentType.includes("application/json")) {
      bodyPayload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      bodyPayload = {
        name: formData.get("name") || "Traveler",
        country: formData.get("country") || "Bangladesh",
        feedback: formData.get("feedback") || "",
        rating: Number(formData.get("rating")) || 5,
        backgroundImage: typeof formData.get("backgroundImage") === "string" ? formData.get("backgroundImage") : null,
        avatarImage: typeof formData.get("avatarImage") === "string" ? formData.get("avatarImage") : null,
      };
    } else {
      bodyPayload = await request.json();
    }

    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${BACKEND_URL}/api/v1/testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
  }
}
