import { NextResponse } from "next/server";
import { getForwardHeaders } from "@/lib/proxyHelper";
import { getBackendUrl } from "@/config/env";

export async function GET(request) {
  try {
    const backendUrl = getBackendUrl();
    const { searchParams } = new URL(request.url);
    const headers = getForwardHeaders(request);
    const res = await fetch(`${backendUrl}/api/v1/booking-enquiries?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch booking enquiries" }, { status: 500 });
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
        customerName: formData.get("name") || formData.get("customerName") || "Guest",
        customerEmail: formData.get("email") || formData.get("customerEmail") || "",
        customerPhone: formData.get("phone") || formData.get("customerPhone") || "",
        pickupLocation: formData.get("pickupLocation") || null,
        travelDate: formData.get("date") || formData.get("travelDate") || null,
        guestCount: formData.get("people") || formData.get("guestCount") ? parseInt(formData.get("people") || formData.get("guestCount"), 10) : 1,
        specialNotes: formData.get("notes") || formData.get("specialNotes") || formData.get("message") || null,
        totalAmount: formData.get("totalAmount") ? parseFloat(formData.get("totalAmount")) : null,
        packageId: formData.get("packageId") || null,
        packageName: formData.get("destination") || formData.get("packageName") || formData.get("tourPackage") || "Tour Package",
      };
    } else {
      const json = await request.json();
      body = {
        customerName: json.customerName || json.name || "Guest",
        customerEmail: json.customerEmail || json.email || "",
        customerPhone: json.customerPhone || json.phone || "",
        pickupLocation: json.pickupLocation || null,
        travelDate: json.travelDate || json.date || null,
        guestCount: json.guestCount ? parseInt(json.guestCount, 10) : (json.people ? parseInt(json.people, 10) : 1),
        specialNotes: json.specialNotes || json.notes || json.message || null,
        totalAmount: json.totalAmount ? parseFloat(json.totalAmount) : null,
        packageId: json.packageId || null,
        packageName: json.packageName || json.destination || json.tourPackage || "Tour Package",
      };
    }

    const res = await fetch(`${backendUrl}/api/v1/booking-enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data.data || data, { status: res.status });
  } catch (error) {
    console.error("[Booking Enquiry Route Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to submit booking enquiry" }, { status: 500 });
  }
}
