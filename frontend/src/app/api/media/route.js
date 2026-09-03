import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/media?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/media/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to upload media" }, { status: 500 });
  }
}
