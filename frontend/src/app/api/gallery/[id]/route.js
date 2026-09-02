import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete gallery item" }, { status: 500 });
  }
}
