/**
 * Utility functions for handling GA4 date ranges and preset calculations.
 */

/**
 * Returns formatted YYYY-MM-DD date string for N days ago from today.
 */
function getPastDateString(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

/**
 * Normalizes start and end dates based on presets or custom values.
 * Default preset is "30days".
 */
export function resolveDateRange(startDateInput, endDateInput) {
  const today = getPastDateString(0);
  const yesterday = getPastDateString(1);

  if (!startDateInput && !endDateInput) {
    return {
      startDate: getPastDateString(29), // 30 days including today
      endDate: today,
      preset: "30days",
    };
  }

  // Handle Preset identifiers
  switch (startDateInput) {
    case "today":
      return { startDate: today, endDate: today, preset: "today" };
    case "yesterday":
      return { startDate: yesterday, endDate: yesterday, preset: "yesterday" };
    case "7days":
      return { startDate: getPastDateString(6), endDate: today, preset: "7days" };
    case "30days":
      return { startDate: getPastDateString(29), endDate: today, preset: "30days" };
    case "90days":
      return { startDate: getPastDateString(89), endDate: today, preset: "90days" };
    default:
      break;
  }

  // Validate custom date strings (YYYY-MM-DD or GA4 format)
  const startDate = startDateInput || getPastDateString(29);
  const endDate = endDateInput || today;

  return {
    startDate,
    endDate,
    preset: "custom",
  };
}

/**
 * Simple regex validator for YYYY-MM-DD date format.
 */
export function isValidDateFormat(dateStr) {
  if (!dateStr) return false;
  // Allow preset identifiers or GA4 keywords or YYYY-MM-DD format
  const validPresets = [
    "today",
    "yesterday",
    "7days",
    "30days",
    "90days",
    "7daysAgo",
    "30daysAgo",
    "90daysAgo",
    "custom",
  ];
  if (validPresets.includes(dateStr)) {
    return true;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}
