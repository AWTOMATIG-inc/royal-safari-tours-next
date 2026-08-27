import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function DELETE(_request, context) {
  const { id } = await context.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/gallery/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`DELETE /api/client-gallery/${id} error:`, error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  try {
    const contentType = request.headers.get("content-type") || "";

    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      res = await fetch(`${BACKEND_URL}/api/v1/gallery/${id}`, {
        method: "PATCH",
        body: formData,
      });
    } else {
      const body = await request.json();
      res = await fetch(`${BACKEND_URL}/api/v1/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`PATCH /api/client-gallery/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}
