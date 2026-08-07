import { fetchMeta, getMetaConfig } from "./client";
import { getPlatformLabel } from "./overview";

/**
 * Fetches campaigns for the configured ad account, along with performance insights and platform breakdowns.
 */
export async function getCampaigns(startDate, endDate) {
  const config = getMetaConfig();
  
  const fields = [
    "id",
    "name",
    "objective",
    "status",
    "buying_type",
    "daily_budget",
    "lifetime_budget",
    `insights.time_range({"since":"${startDate}","until":"${endDate}"}){spend,reach,impressions,clicks,ctr,cpc,cpm}`,
  ].join(",");

  // Fetch campaigns list and platform breakdowns in parallel to maximize performance
  const [campaignsRes, platformInsightsRes] = await Promise.all([
    fetchMeta(`${config.adAccountId}/campaigns`, {
      params: {
        fields,
        limit: "150",
      },
    }),
    fetchMeta(`${config.adAccountId}/insights`, {
      params: {
        level: "campaign",
        breakdowns: "publisher_platform",
        fields: "campaign_id,spend,reach,clicks,ctr",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
        limit: "500",
      },
    }).catch((err) => {
      console.warn("[Meta Campaigns Service] Platform breakdown insights failed:", err.message);
      return { data: [] };
    }),
  ]);

  const rawCampaigns = campaignsRes.data || [];
  const rawPlatformInsights = platformInsightsRes.data || [];

  // Group platform breakdown rows by campaign_id
  const platformBreakdownByCampaign = {};
  rawPlatformInsights.forEach((row) => {
    const cId = row.campaign_id;
    if (!cId) return;
    if (!platformBreakdownByCampaign[cId]) {
      platformBreakdownByCampaign[cId] = [];
    }
    platformBreakdownByCampaign[cId].push({
      platform: getPlatformLabel(row.publisher_platform),
      spend: parseFloat(row.spend || "0"),
      reach: parseInt(row.reach || "0", 10),
      clicks: parseInt(row.clicks || "0", 10),
      ctr: parseFloat(row.ctr || "0") * 100,
    });
  });

  return rawCampaigns.map((camp) => {
    const insightNode = camp.insights?.data?.[0] || {};
    const dailyBudget = camp.daily_budget ? parseFloat(camp.daily_budget) : 0;
    const lifetimeBudget = camp.lifetime_budget ? parseFloat(camp.lifetime_budget) : 0;

    return {
      id: camp.id,
      name: camp.name || "Unnamed Campaign",
      status: camp.status || "UNKNOWN",
      objective: camp.objective || "UNKNOWN",
      buyingType: camp.buying_type || "UNKNOWN",
      dailyBudget,
      lifetimeBudget,
      spend: parseFloat(insightNode.spend || "0"),
      reach: parseInt(insightNode.reach || "0", 10),
      impressions: parseInt(insightNode.impressions || "0", 10),
      clicks: parseInt(insightNode.clicks || "0", 10),
      ctr: parseFloat(insightNode.ctr || "0") * 100,
      cpc: parseFloat(insightNode.cpc || "0"),
      cpm: parseFloat(insightNode.cpm || "0"),
      platforms: platformBreakdownByCampaign[camp.id] || [],
    };
  });
}
