import { fetchMeta, getMetaConfig } from "./client";

/**
 * Queries details and event stats for the configured Meta Pixel.
 */
export async function getPixelDetails() {
  const config = getMetaConfig();

  if (!config.pixelId) {
    return {
      id: "Not Configured",
      name: "Meta Pixel",
      status: "NOT_CONFIGURED",
      eventCount: 0,
      recentEvents: [],
    };
  }

  try {
    // 1. Fetch Pixel Info (use only stable fields to prevent schema changes errors across API versions)
    const pixelInfo = await fetchMeta(`${config.pixelId}`, {
      params: {
        fields: "id,name",
      },
    });

    // 2. Fetch Pixel Stats (returns event volumes over the last 7 days)
    const pixelStats = await fetchMeta(`${config.pixelId}/stats`, {
      params: {
        last_x_days: "7",
      },
    }).catch((err) => {
      console.warn("[Meta Pixel Stats Query Warning]:", err.message);
      return { data: [] };
    });

    const statsData = pixelStats?.data || [];
    
    const recentEvents = statsData.map((item) => ({
      eventName: item.event || "Unknown Event",
      count: parseInt(item.value || "0", 10),
    }));

    const eventCount = recentEvents.reduce((sum, item) => sum + item.count, 0);

    // Determine status and activity timeframes based on live statistics
    let status = "NO_ACTIVITY";
    let lastReceivedEvent = undefined;

    if (eventCount > 0) {
      status = "ACTIVE";
      lastReceivedEvent = "Active in the last 7 days";
    }

    return {
      id: pixelInfo.id,
      name: pixelInfo.name || "Meta Pixel",
      status,
      lastReceivedEvent,
      eventCount,
      connectedDomain: undefined,
      recentEvents,
    };
  } catch (error) {
    console.error("[Meta Pixel Service Error]:", error.message);
    throw error;
  }
}
