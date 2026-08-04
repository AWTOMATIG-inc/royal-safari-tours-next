import { fetchMeta, getMetaConfig } from "./client";
import { getPlatformLabel } from "./overview";

/**
 * Fetches daily time-series performance insights for the configured ad account, broken down by platform.
 */
export async function getInsights(startDate, endDate) {
  const config = getMetaConfig();

  const fields = [
    "date_start",
    "spend",
    "reach",
    "impressions",
    "clicks",
    "ctr",
    "cpc",
    "cpm",
    "actions",
  ].join(",");

  // Query daily insights broken down by publisher_platform
  const response = await fetchMeta(`${config.adAccountId}/insights`, {
    params: {
      fields,
      time_range: JSON.stringify({ since: startDate, until: endDate }),
      time_increment: "1",
      breakdowns: "publisher_platform",
      limit: "400", // Large limit to handle multiple platforms per day
    },
  });

  const rawInsights = response.data || [];

  // Sort chronological
  const sorted = rawInsights.sort((a, b) => {
    return new Date(a.date_start).getTime() - new Date(b.date_start).getTime();
  });

  return sorted.map((insight) => {
    const actionsList = insight.actions || [];
    
    // Link Clicks
    const linkClicksAction = actionsList.find((a) => a.action_type === "link_click");
    const linkClicks = linkClicksAction ? parseInt(linkClicksAction.value || "0", 10) : 0;

    // Conversions
    const conversions = actionsList.reduce((acc, action) => {
      const type = action.action_type || "";
      if (type === "purchase" || type === "lead" || type.startsWith("offsite_conversion")) {
        return acc + parseInt(action.value || "0", 10);
      }
      return acc;
    }, 0);

    const spend = parseFloat(insight.spend || "0");
    const costPerResult = conversions > 0 ? spend / conversions : (linkClicks > 0 ? spend / linkClicks : 0);

    return {
      date: insight.date_start,
      platform: getPlatformLabel(insight.publisher_platform),
      platformKey: insight.publisher_platform || "unknown",
      spend,
      reach: parseInt(insight.reach || "0", 10),
      impressions: parseInt(insight.impressions || "0", 10),
      clicks: parseInt(insight.clicks || "0", 10),
      linkClicks,
      ctr: parseFloat(insight.ctr || "0") * 100,
      cpc: parseFloat(insight.cpc || "0"),
      cpm: parseFloat(insight.cpm || "0"),
      costPerResult,
      conversions,
    };
  });
}
