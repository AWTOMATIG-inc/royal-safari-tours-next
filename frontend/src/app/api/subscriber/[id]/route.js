import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const { id } = await params;
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/subscribers/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete subscriber" }, { status: 500 });
  }
}
