import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/contacts/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact inquiry" }, { status: 500 });
  }
}

async function handleStatusUpdate(request, params) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    let body = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = { status: formData.get("status") };
    } else {
      try {
        body = await request.json();
      } catch {
        body = {};
      }
    }

    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const res = await fetch(`${backendUrl}/api/v1/contacts/${id}/status`, {
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

export async function PATCH(request, { params }) {
  return handleStatusUpdate(request, params);
}

export async function PUT(request, { params }) {
  return handleStatusUpdate(request, params);
}

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/contacts/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete contact inquiry" }, { status: 500 });
  }
}
