import { fetchMeta, getMetaConfig } from "./client";

/**
 * Maps publisher platform keys to human-readable names.
 */
export function getPlatformLabel(platform) {
  if (!platform) return "Other";
  const p = platform.toLowerCase();
  if (p === "facebook") return "Facebook";
  if (p === "instagram") return "Instagram";
  if (p === "messenger") return "Messenger";
  if (p === "audience_network") return "Audience Network";
  if (p === "threads") return "Threads";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

/**
 * Maps publisher platform + platform position to a standard placement label.
 */
export function getPlacementLabel(platform, position) {
  if (!platform) return "Other";
  const p = platform.toLowerCase();
  const pos = (position || "").toLowerCase();

  if (p === "facebook") {
    if (pos === "feed") return "Facebook Feed";
    if (pos === "story" || pos === "stories") return "Facebook Stories";
    if (pos === "instream_video" || pos === "video_feed" || pos === "suggested_video") return "Facebook Video Feed";
    if (pos === "marketplace") return "Facebook Marketplace";
    if (pos === "reels" || pos === "facebook_reels") return "Facebook Reels";
  }
  if (p === "instagram") {
    if (pos === "feed") return "Instagram Feed";
    if (pos === "story" || pos === "stories") return "Instagram Stories";
    if (pos === "explore") return "Instagram Explore";
    if (pos === "reels" || pos === "instagram_reels") return "Instagram Reels";
    if (pos === "profile_feed") return "Instagram Profile Feed";
  }
  if (p === "messenger") {
    if (pos === "messenger_inbox") return "Messenger Inbox";
    if (pos === "story" || pos === "stories") return "Messenger Stories";
  }
  if (p === "audience_network") {
    return "Audience Network";
  }
  if (p === "threads") {
    return "Threads Feed";
  }

  // Dynamic fallback
  const capPlatform = p.charAt(0).toUpperCase() + p.slice(1);
  const capPosition = pos
    ? pos.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "General";
  return `${capPlatform} ${capPosition}`;
}

/**
 * Fetches high-level summary metrics (overview) and active counts for campaigns and ads,
 * as well as platform-level and placement-level breakdowns.
 */
export async function getOverview(startDate, endDate) {
  const config = getMetaConfig();

  // Run initial summary count + active queries in parallel
  const [insightsRes, activeCampaignsRes, activeAdsRes, platformsRes, placementsRes] = await Promise.all([
    // 1. Aggregated Summary
    fetchMeta(`${config.adAccountId}/insights`, {
      params: {
        fields: "spend,reach,impressions,clicks,ctr,cpc,cpm",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
      },
    }).catch((err) => {
      console.error("[Meta Overview Service] Insights Summary Query Failed:", err.message);
      return { data: [] };
    }),

    // 2. Active Campaign Count
    fetchMeta(`${config.adAccountId}/campaigns`, {
      params: {
        filtering: JSON.stringify([{ field: "effective_status", operator: "IN", value: ["ACTIVE"] }]),
        limit: "1",
        summary: "true",
      },
    }).catch((err) => {
      console.error("[Meta Overview Service] Active Campaigns Query Failed:", err.message);
      return { summary: { total_count: 0 } };
    }),

    // 3. Active Ads Count
    fetchMeta(`${config.adAccountId}/ads`, {
      params: {
        filtering: JSON.stringify([{ field: "effective_status", operator: "IN", value: ["ACTIVE"] }]),
        limit: "1",
        summary: "true",
      },
    }).catch((err) => {
      console.error("[Meta Overview Service] Active Ads Query Failed:", err.message);
      return { summary: { total_count: 0 } };
    }),

    // 4. Platform Breakdown
    fetchMeta(`${config.adAccountId}/insights`, {
      params: {
        fields: "spend,reach,impressions,clicks,ctr,cpc,cpm,frequency",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
        breakdowns: "publisher_platform",
      },
    }).catch((err) => {
      console.warn("[Meta Overview Service] Platform breakdown query failed/unsupported. Falling back. Error:", err.message);
      return { data: [], breakdown_error: err.message };
    }),

    // 5. Placement Breakdown
    fetchMeta(`${config.adAccountId}/insights`, {
      params: {
        fields: "spend,reach,impressions,clicks,ctr,cpc,cpm",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
        breakdowns: "publisher_platform,platform_position",
      },
    }).catch((err) => {
      console.warn("[Meta Overview Service] Placement breakdown query failed/unsupported. Falling back. Error:", err.message);
      return { data: [], breakdown_error: err.message };
    }),
  ]);

  const summary = insightsRes?.data?.[0] || {};
  const activeCampaignCount = activeCampaignsRes?.summary?.total_count ?? 0;
  const activeAdsCount = activeAdsRes?.summary?.total_count ?? 0;

  // Process Platform Breakdown rows
  const platformsDataRaw = platformsRes?.data || [];
  const platforms = platformsDataRaw.map((row) => ({
    platformKey: row.publisher_platform || "unknown",
    platform: getPlatformLabel(row.publisher_platform),
    spend: parseFloat(row.spend || "0"),
    reach: parseInt(row.reach || "0", 10),
    impressions: parseInt(row.impressions || "0", 10),
    clicks: parseInt(row.clicks || "0", 10),
    ctr: parseFloat(row.ctr || "0") * 100,
    cpc: parseFloat(row.cpc || "0"),
    cpm: parseFloat(row.cpm || "0"),
    frequency: parseFloat(row.frequency || "0"),
  })).filter(p => p.spend > 0 || p.reach > 0);

  // Process Placement Breakdown rows
  const placementsDataRaw = placementsRes?.data || [];
  const placements = placementsDataRaw.map((row) => ({
    placementKey: `${row.publisher_platform || "unknown"}_${row.platform_position || "unknown"}`,
    placement: getPlacementLabel(row.publisher_platform, row.platform_position),
    platform: getPlatformLabel(row.publisher_platform),
    spend: parseFloat(row.spend || "0"),
    reach: parseInt(row.reach || "0", 10),
    impressions: parseInt(row.impressions || "0", 10),
    clicks: parseInt(row.clicks || "0", 10),
    ctr: parseFloat(row.ctr || "0") * 100,
    cpc: parseFloat(row.cpc || "0"),
    cpm: parseFloat(row.cpm || "0"),
  })).filter(pl => pl.spend > 0);

  return {
    totalSpend: parseFloat(summary.spend || "0"),
    reach: parseInt(summary.reach || "0", 10),
    impressions: parseInt(summary.impressions || "0", 10),
    clicks: parseInt(summary.clicks || "0", 10),
    ctr: parseFloat(summary.ctr || "0") * 100,
    cpc: parseFloat(summary.cpc || "0"),
    cpm: parseFloat(summary.cpm || "0"),
    activeCampaignCount,
    activeAdsCount,
    platforms,
    placements,
    hasBreakdownError: !!(platformsRes?.breakdown_error || placementsRes?.breakdown_error),
    breakdownError: platformsRes?.breakdown_error || placementsRes?.breakdown_error || null
  };
}
