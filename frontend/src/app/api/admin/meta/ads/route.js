import { resolveDateRange, isValidDateFormat } from "@/lib/analytics/google/dateUtils";
import { getAds } from "@/lib/meta";
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

    // 2. Parse & Validate Date Query Parameters
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

    // 3. Fetch Ads Data from Meta Service
    const adsData = await getAds(startDate, endDate);

    // 4. Memory-based Filter, Search, Sort & Paginate
    let filtered = [...adsData];

    // Filter by status
    const statusFilter = searchParams.get("status") || "all";
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ad) => ad.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by search query
    const searchQuery = searchParams.get("search") || "";
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ad) =>
          ad.name.toLowerCase().includes(q) ||
          ad.campaignName.toLowerCase().includes(q) ||
          ad.adSetName.toLowerCase().includes(q)
      );
    }

    // Sort by field
    const sortBy = searchParams.get("sortBy") || "spend";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const isAsc = sortOrder === "asc";

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    // Paginate
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        success: true,
        dateRange: {
          startDate,
          endDate,
          preset,
        },
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
        ads: paginated,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Meta Ads API Error]:", error.message || error);

    const status = error.status || 500;
    const code = error.code || "META_ADS_FETCH_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message: error.message || "Unable to retrieve Meta Ads list data.",
        },
      },
      { status }
    );
  }
}
