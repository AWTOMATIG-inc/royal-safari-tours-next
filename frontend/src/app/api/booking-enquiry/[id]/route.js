import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/booking-enquiries/${id}`, { headers, cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch booking enquiry" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
    const body = await request.json();

    const res = await fetch(`${backendUrl}/api/v1/booking-enquiries/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update booking enquiry" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/booking-enquiries/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete booking enquiry" }, { status: 500 });
  }
}
