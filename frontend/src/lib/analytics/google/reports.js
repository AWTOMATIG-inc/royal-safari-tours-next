import { getAnalyticsClient } from "./client";

/**
 * Normalizes GA4 API row values into a structured Javascript object.
 */
function parseRow(row, dimensionNames, metricNames) {
  const item = {};

  (dimensionNames || []).forEach((name, index) => {
    item[name] = row.dimensionValues?.[index]?.value ?? "";
  });

  (metricNames || []).forEach((name, index) => {
    const val = row.metricValues?.[index]?.value ?? "0";
    // Check if numeric or float
    if (val.includes(".")) {
      item[name] = parseFloat(val);
    } else {
      item[name] = parseInt(val, 10);
    }
  });

  return item;
}

/**
 * Fetches all GA4 dashboard reports in parallel using batchRunReports or runReport.
 */
export async function getAnalyticsDashboardData(startDate, endDate) {
  const { client, propertyId } = getAnalyticsClient();
  const property = `properties/${propertyId}`;
  const dateRanges = [{ startDate, endDate }];

  // Perform report queries
  const [
    overviewRes,
    trendRes,
    sourcesRes,
    topPagesRes,
    devicesRes,
    locationsRes,
    eventsRes,
    conversionsRes,
  ] = await Promise.all([
    // 1. Overview Report
    client.runReport({
      property,
      dateRanges,
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "screenPageViews" },
        { name: "eventCount" },
        { name: "engagementRate" },
        { name: "userEngagementDuration" },
      ],
    }).catch((err) => {
      console.error("[GA4] Overview Report Error:", err.message);
      return [null];
    }),

    // 2. Daily Traffic Trend Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    }).catch((err) => {
      console.error("[GA4] Trend Report Error:", err.message);
      return [null];
    }),

    // 3. Traffic Sources Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [
        { name: "sessionSource" },
        { name: "sessionMedium" },
        { name: "sessionCampaignName" },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "eventCount" },
      ],
      limit: 15,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }).catch((err) => {
      console.error("[GA4] Traffic Sources Error:", err.message);
      return [null];
    }),

    // 4. Top Pages Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "userEngagementDuration" },
        { name: "eventCount" },
      ],
      limit: 15,
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    }).catch((err) => {
      console.error("[GA4] Top Pages Error:", err.message);
      return [null];
    }),

    // 5. Device Category Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "deviceCategory" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "engagementRate" },
        { name: "eventCount" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }).catch((err) => {
      console.error("[GA4] Device Report Error:", err.message);
      return [null];
    }),

    // 6. Geographic Location Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "country" }, { name: "city" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "eventCount" },
      ],
      limit: 15,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }).catch((err) => {
      console.error("[GA4] Geographic Report Error:", err.message);
      return [null];
    }),

    // 7. Event Names Report
    client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
      limit: 15,
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    }).catch((err) => {
      console.error("[GA4] Events Report Error:", err.message);
      return [null];
    }),

    // 8. Conversions / Key Events Report
    client
      .runReport({
        property,
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "keyEvents" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "keyEvents" }, desc: true }],
        limit: 15,
      })
      .catch(async () => {
        // Fallback if "keyEvents" metric is named "conversions" in legacy GA4 setups
        try {
          const [fallback] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "eventName" }],
            metrics: [{ name: "conversions" }, { name: "activeUsers" }],
            orderBys: [{ metric: { metricName: "conversions" }, desc: true }],
            limit: 15,
          });
          return [fallback];
        } catch (err) {
          return [null];
        }
      }),
  ]);

  // --- 1. Normalize Overview ---
  const overviewRow = overviewRes?.[0]?.rows?.[0];
  const overviewValues = overviewRow?.metricValues || [];
  const totalUsers = parseInt(overviewValues[0]?.value || "0", 10);
  const newUsers = parseInt(overviewValues[1]?.value || "0", 10);
  const sessions = parseInt(overviewValues[2]?.value || "0", 10);
  const engagedSessions = parseInt(overviewValues[3]?.value || "0", 10);
  const pageViews = parseInt(overviewValues[4]?.value || "0", 10);
  const eventCount = parseInt(overviewValues[5]?.value || "0", 10);
  const rawEngagementRate = parseFloat(overviewValues[6]?.value || "0");
  const rawTotalDuration = parseFloat(overviewValues[7]?.value || "0");

  const avgEngagementTimeSeconds =
    totalUsers > 0 ? Math.round(rawTotalDuration / totalUsers) : 0;

  const overview = {
    users: totalUsers,
    newUsers,
    sessions,
    engagedSessions,
    pageViews,
    eventCount,
    engagementRate: (rawEngagementRate * 100).toFixed(1), // format as percentage
    averageEngagementTime: avgEngagementTimeSeconds, // in seconds
  };

  // --- 2. Normalize Traffic Trend ---
  const trafficTrend = (trendRes?.[0]?.rows || []).map((row) => {
    const rawDate = row.dimensionValues?.[0]?.value || "";
    // format YYYYMMDD -> YYYY-MM-DD
    const formattedDate =
      rawDate.length === 8
        ? `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`
        : rawDate;

    return {
      date: formattedDate,
      users: parseInt(row.metricValues?.[0]?.value || "0", 10),
      sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
      pageViews: parseInt(row.metricValues?.[2]?.value || "0", 10),
    };
  });

  // --- 3. Normalize Traffic Sources ---
  const trafficSources = (sourcesRes?.[0]?.rows || []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || "(direct)",
    medium: row.dimensionValues?.[1]?.value || "(none)",
    campaign: row.dimensionValues?.[2]?.value || "(not set)",
    users: parseInt(row.metricValues?.[0]?.value || "0", 10),
    sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
    engagedSessions: parseInt(row.metricValues?.[2]?.value || "0", 10),
    events: parseInt(row.metricValues?.[3]?.value || "0", 10),
  }));

  // --- 4. Normalize Top Pages ---
  const topPages = (topPagesRes?.[0]?.rows || []).map((row) => {
    const views = parseInt(row.metricValues?.[0]?.value || "0", 10);
    const users = parseInt(row.metricValues?.[1]?.value || "0", 10);
    const durationSec = parseFloat(row.metricValues?.[2]?.value || "0");
    const events = parseInt(row.metricValues?.[3]?.value || "0", 10);

    return {
      path: row.dimensionValues?.[0]?.value || "/",
      title: row.dimensionValues?.[1]?.value || "(no title)",
      views,
      users,
      avgEngagementTime: users > 0 ? Math.round(durationSec / users) : 0,
      events,
    };
  });

  // --- 5. Normalize Devices ---
  const devices = (devicesRes?.[0]?.rows || []).map((row) => ({
    device: row.dimensionValues?.[0]?.value || "desktop",
    users: parseInt(row.metricValues?.[0]?.value || "0", 10),
    sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
    engagementRate: (parseFloat(row.metricValues?.[2]?.value || "0") * 100).toFixed(1),
    events: parseInt(row.metricValues?.[3]?.value || "0", 10),
  }));

  // --- 6. Normalize Geographic ---
  const locations = (locationsRes?.[0]?.rows || []).map((row) => ({
    country: row.dimensionValues?.[0]?.value || "(not set)",
    city: row.dimensionValues?.[1]?.value || "(not set)",
    users: parseInt(row.metricValues?.[0]?.value || "0", 10),
    sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
    events: parseInt(row.metricValues?.[2]?.value || "0", 10),
  }));

  // --- 7. Normalize Events ---
  const events = (eventsRes?.[0]?.rows || []).map((row) => ({
    eventName: row.dimensionValues?.[0]?.value || "unknown",
    count: parseInt(row.metricValues?.[0]?.value || "0", 10),
    users: parseInt(row.metricValues?.[1]?.value || "0", 10),
  }));

  // --- 8. Normalize Conversions / Key Events ---
  const conversions = (conversionsRes?.[0]?.rows || [])
    .map((row) => ({
      eventName: row.dimensionValues?.[0]?.value || "conversion",
      count: parseInt(row.metricValues?.[0]?.value || "0", 10),
      users: parseInt(row.metricValues?.[1]?.value || "0", 10),
    }))
    .filter((item) => item.count > 0);

  return {
    overview,
    trafficTrend,
    trafficSources,
    topPages,
    devices,
    locations,
    events,
    conversions,
  };
}
