import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request) {
  try {
    const backendUrl = getBackendUrl();
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/tour-locations?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data.data || [], { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      const country = formData.get("country");
      const description = formData.get("description");
      const image = formData.get("image");
      body = {
        country,
        description: description || "",
        image: typeof image === "string" ? image : "",
      };
    }

    const backendUrl = getBackendUrl();
    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/tour-locations`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to create location" }, { status: res.status });
    }
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    console.error("POST Location Error:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
