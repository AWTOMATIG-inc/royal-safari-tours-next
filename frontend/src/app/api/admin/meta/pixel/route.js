import { getPixelDetails } from "@/lib/meta";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // 1. Authenticate Admin User
    const nextCookies = await cookies();
    const token = nextCookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    const activeToken = token || bearerToken;
    const admin = await verifyToken(activeToken);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required to access Meta Ads analytics.",
          },
        },
        { status: 401 }
      );
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(admin.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access forbidden. Admin role required.",
          },
        },
        { status: 403 }
      );
    }

    // 2. Retrieve Pixel Details and Stats
    const pixelData = await getPixelDetails();

    // 3. Return Normalized JSON Response
    return NextResponse.json(
      {
        success: true,
        pixel: pixelData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Meta Pixel API Error]:", error.message || error);

    const status = error.status || 500;
    const code = error.code || "META_PIXEL_FETCH_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message: error.message || "Unable to retrieve Meta Pixel events data.",
        },
      },
      { status }
    );
  }
}
