import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/tour-packages/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tour package" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const body = await request.json();
    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/tour-packages/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to update tour package" }, { status: res.status });
    }
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update tour package" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/tour-packages/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete tour package" }, { status: 500 });
  }
}
