import { fetchMeta, getMetaConfig } from "./client";

/**
 * Fetches ad sets for the configured ad account, along with performance insights for the given date range.
 */
export async function getAdSets(startDate, endDate) {
  const config = getMetaConfig();

  const fields = [
    "id",
    "name",
    "campaign{id,name}",
    "status",
    "daily_budget",
    "lifetime_budget",
    `insights.time_range({"since":"${startDate}","until":"${endDate}"}){spend,reach,actions}`,
  ].join(",");

  const response = await fetchMeta(`${config.adAccountId}/adsets`, {
    params: {
      fields,
      limit: "150",
    },
  });

  const rawAdSets = response.data || [];

  return rawAdSets.map((adset) => {
    const insightNode = adset.insights?.data?.[0] || {};
    const dailyBudget = adset.daily_budget ? parseFloat(adset.daily_budget) : 0;
    const lifetimeBudget = adset.lifetime_budget ? parseFloat(adset.lifetime_budget) : 0;

    // Summarize standard actions as 'results'
    const actionsList = insightNode.actions || [];
    const results = actionsList.reduce((acc, action) => {
      const type = action.action_type || "";
      if (
        type === "link_click" ||
        type === "lead" ||
        type === "purchase" ||
        type.startsWith("offsite_conversion")
      ) {
        return acc + parseInt(action.value || "0", 10);
      }
      return acc;
    }, 0);

    return {
      id: adset.id,
      name: adset.name || "Unnamed Ad Set",
      campaignId: adset.campaign?.id || "",
      campaignName: adset.campaign?.name || "Unnamed Campaign",
      status: adset.status || "UNKNOWN",
      dailyBudget,
      lifetimeBudget,
      spend: parseFloat(insightNode.spend || "0"),
      reach: parseInt(insightNode.reach || "0", 10),
      results,
    };
  });
}
