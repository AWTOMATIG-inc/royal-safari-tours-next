import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Bulletproof Private Key Formatter for Node.js / OpenSSL.
 * Handles escaped linebreaks, Windows carriage returns (\r), extra quotes,
 * and mangled whitespace in .env files.
 */
function formatPrivateKey(rawKey) {
  if (!rawKey) return "";

  let str = rawKey.trim();

  // Strip leading and trailing quotes if present
  while (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }

  // Remove Windows carriage returns (\r)
  str = str.replace(/\r/g, "");

  // Replace literal '\n' or '\\n' string representations with actual newlines
  str = str.replace(/\\n/g, "\n");

  const beginMarker = "-----BEGIN PRIVATE KEY-----";
  const endMarker = "-----END PRIVATE KEY-----";
  const rsaBeginMarker = "-----BEGIN RSA PRIVATE KEY-----";
  const rsaEndMarker = "-----END RSA PRIVATE KEY-----";

  if (str.includes(beginMarker) && str.includes(endMarker)) {
    const startIndex = str.indexOf(beginMarker) + beginMarker.length;
    const endIndex = str.indexOf(endMarker);
    const body = str.substring(startIndex, endIndex).replace(/\s+/g, "");
    return `${beginMarker}\n${body}\n${endMarker}\n`;
  }

  if (str.includes(rsaBeginMarker) && str.includes(rsaEndMarker)) {
    const startIndex = str.indexOf(rsaBeginMarker) + rsaBeginMarker.length;
    const endIndex = str.indexOf(rsaEndMarker);
    const body = str.substring(startIndex, endIndex).replace(/\s+/g, "");
    return `${rsaBeginMarker}\n${body}\n${rsaEndMarker}\n`;
  }

  // Fallback: If markers are missing, treat as raw base64 body
  const cleanBody = str.replace(/\s+/g, "");
  return `${beginMarker}\n${cleanBody}\n${endMarker}\n`;
}

/**
 * Initializes and returns an authenticated Google Analytics 4 Data API client
 * and configured Property ID.
 *
 * Server-only module. Never import into client components.
 */
export function getAnalyticsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!clientEmail || !privateKeyRaw || !propertyId) {
    throw new Error("Google Analytics configuration is incomplete.");
  }

  const formattedKey = formatPrivateKey(privateKeyRaw);

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail.trim(),
      private_key: formattedKey,
    },
  });

  return {
    client: analyticsDataClient,
    propertyId: propertyId.trim(),
  };
}
