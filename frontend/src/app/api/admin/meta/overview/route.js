import { resolveDateRange, isValidDateFormat } from "@/lib/analytics/google/dateUtils";
import { getOverview } from "@/lib/meta";
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
            message: "Admin authorization required to access Meta Ads analytics.",
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse & Validate Query Parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (startDateParam && !isValidDateFormat(startDateParam)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DATE_FORMAT",
            message: "Invalid startDate format. Use YYYY-MM-DD or valid presets.",
          },
        },
        { status: 400 }
      );
    }

    if (endDateParam && !isValidDateFormat(endDateParam)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DATE_FORMAT",
            message: "Invalid endDate format. Use YYYY-MM-DD format.",
          },
        },
        { status: 400 }
      );
    }

    const { startDate, endDate, preset } = resolveDateRange(
      startDateParam,
      endDateParam
    );

    // 3. Retrieve Meta Ads Overview Data
    const overviewData = await getOverview(startDate, endDate);

    // 4. Return Normalized JSON Response
    return NextResponse.json(
      {
        success: true,
        dateRange: {
          startDate,
          endDate,
          preset,
        },
        ...overviewData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Meta Overview API Error]:", error.message || error);

    const status = error.status || 500;
    const code = error.code || "META_OVERVIEW_FETCH_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message: error.message || "Unable to retrieve Meta Ads overview data.",
        },
      },
      { status }
    );
  }
}
