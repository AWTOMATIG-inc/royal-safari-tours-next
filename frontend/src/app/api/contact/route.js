import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request) {
  try {
    const backendUrl = getBackendUrl();
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/contacts?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data.data || [], { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const backendUrl = getBackendUrl();
    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        name: formData.get("name") || "Guest",
        email: formData.get("email") || "",
        phone: formData.get("phone") || "",
        message: formData.get("message") || "",
        destination: formData.get("destination") || formData.get("tourPackage") || null,
        travelDate: formData.get("date") || formData.get("travelDate") || null,
        guestCount: formData.get("people") ? parseInt(formData.get("people"), 10) : 1,
        notes: formData.get("notes") || null,
      };
    } else {
      body = await request.json();
    }

    const res = await fetch(`${backendUrl}/api/v1/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    console.error("[Contact Route Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to submit contact inquiry" }, { status: 500 });
  }
}
