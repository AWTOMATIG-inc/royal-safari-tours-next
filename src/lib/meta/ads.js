import { fetchMeta, getMetaConfig } from "./client";
import { getPlatformLabel, getPlacementLabel } from "./overview";

/**
 * Fetches ads for the configured ad account, along with performance insights, primary platforms, and placement lists.
 */
export async function getAds(startDate, endDate) {
  const config = getMetaConfig();

  const fields = [
    "id",
    "name",
    "campaign{name}",
    "adset{name}",
    "status",
    `insights.time_range({"since":"${startDate}","until":"${endDate}"}){spend,reach,impressions,clicks,ctr,cpc,cpm}`,
  ].join(",");

  // Fetch ads and their placement-level breakdowns in parallel
  const [adsRes, placementInsightsRes] = await Promise.all([
    fetchMeta(`${config.adAccountId}/ads`, {
      params: {
        fields,
        limit: "150",
      },
    }),
    fetchMeta(`${config.adAccountId}/insights`, {
      params: {
        level: "ad",
        breakdowns: "publisher_platform,platform_position",
        fields: "ad_id,spend,reach,ctr",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
        limit: "800",
      },
    }).catch((err) => {
      console.warn("[Meta Ads Service] Placement breakdown query failed:", err.message);
      return { data: [] };
    }),
  ]);

  const rawAds = adsRes.data || [];
  const rawPlacements = placementInsightsRes.data || [];

  // Group placement insights by ad_id
  const placementDataByAd = {};
  rawPlacements.forEach((row) => {
    const adId = row.ad_id;
    if (!adId) return;
    if (!placementDataByAd[adId]) {
      placementDataByAd[adId] = [];
    }
    placementDataByAd[adId].push(row);
  });

  return rawAds.map((ad) => {
    const insightNode = ad.insights?.data?.[0] || {};
    const adPlacements = placementDataByAd[ad.id] || [];

    let primaryPlatform = "Unknown";
    const placementsUsed = [];
    const spendByPlatform = {};

    adPlacements.forEach((row) => {
      const p = getPlatformLabel(row.publisher_platform);
      const spend = parseFloat(row.spend || "0");
      if (spend > 0) {
        spendByPlatform[p] = (spendByPlatform[p] || 0) + spend;
        const placementName = getPlacementLabel(row.publisher_platform, row.platform_position);
        if (!placementsUsed.includes(placementName)) {
          placementsUsed.push(placementName);
        }
      }
    });

    // Find primary platform (highest spend)
    let maxSpend = -1;
    Object.keys(spendByPlatform).forEach((p) => {
      if (spendByPlatform[p] > maxSpend) {
        maxSpend = spendByPlatform[p];
        primaryPlatform = p;
      }
    });

    if (primaryPlatform === "Unknown" && adPlacements.length > 0) {
      primaryPlatform = getPlatformLabel(adPlacements[0].publisher_platform);
    }

    return {
      id: ad.id,
      name: ad.name || "Unnamed Ad",
      campaignName: ad.campaign?.name || "Unnamed Campaign",
      adSetName: ad.adset?.name || "Unnamed Ad Set",
      status: ad.status || "UNKNOWN",
      spend: parseFloat(insightNode.spend || "0"),
      reach: parseInt(insightNode.reach || "0", 10),
      impressions: parseInt(insightNode.impressions || "0", 10),
      clicks: parseInt(insightNode.clicks || "0", 10),
      ctr: parseFloat(insightNode.ctr || "0") * 100,
      cpc: parseFloat(insightNode.cpc || "0"),
      cpm: parseFloat(insightNode.cpm || "0"),
      primaryPlatform,
      placementsUsed: placementsUsed.length > 0 ? placementsUsed : ["All Placements"],
    };
  });
}
