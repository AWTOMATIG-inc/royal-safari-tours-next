import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function DELETE(request, context) {
  const { id } = await context.params;
  try {
    const backendUrl = getBackendUrl();
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/gallery/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`DELETE /api/client-gallery/${id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to delete gallery item" }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  try {
    const backendUrl = getBackendUrl();
    const contentType = request.headers.get("content-type") || "";

    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const headers = getForwardHeaders(request);
      res = await fetch(`${backendUrl}/api/v1/gallery/${id}`, {
        method: "PATCH",
        headers,
        body: formData,
      });
    } else {
      const body = await request.json();
      const headers = getForwardHeaders(request, { "Content-Type": "application/json" });
      res = await fetch(`${backendUrl}/api/v1/gallery/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`PATCH /api/client-gallery/${id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to update gallery item" }, { status: 500 });
  }
}
