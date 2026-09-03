import { resolveDateRange, isValidDateFormat } from "@/lib/analytics/google/dateUtils";
import { getAnalyticsDashboardData } from "@/lib/analytics/google/reports";
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
            message: "Authentication required to access analytics.",
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

    // 3. Retrieve GA4 Analytics Data
    const analyticsData = await getAnalyticsDashboardData(startDate, endDate);

    // 4. Return Normalized JSON Response
    return NextResponse.json(
      {
        success: true,
        dateRange: {
          startDate,
          endDate,
          preset,
        },
        ...analyticsData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Analytics API Error]:", error.message || error);

    // Safe error message for client
    const isConfigError = error.message?.includes("incomplete");

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isConfigError ? "CONFIG_ERROR" : "ANALYTICS_FETCH_FAILED",
          message: isConfigError
            ? "Google Analytics configuration is incomplete."
            : "Unable to retrieve Google Analytics data. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
