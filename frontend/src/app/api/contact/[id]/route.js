import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/contacts/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact inquiry" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${BACKEND_URL}/api/v1/contacts/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update contact status" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${BACKEND_URL}/api/v1/contacts/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete contact inquiry" }, { status: 500 });
  }
}
