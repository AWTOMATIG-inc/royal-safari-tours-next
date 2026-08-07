import {
  MetaAuthenticationError,
  MetaConfigurationError,
  MetaNetworkError,
  MetaPermissionError,
  MetaRateLimitError,
  MetaValidationError,
  MetaApiError,
  MetaError,
} from "./errors";

const DEFAULT_API_VERSION = "v21.0";
const BASE_URL = "https://graph.facebook.com";
const TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 30000;

const memoryCache = new Map();

/**
 * Validates and retrieves the Meta API configuration.
 */
export function getMetaConfig() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const adAccountIdRaw = process.env.META_AD_ACCOUNT_ID;
  const businessId = process.env.META_BUSINESS_ID;
  const pageId = process.env.META_PAGE_ID;
  const pixelId = process.env.META_PIXEL_ID;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const apiVersion = process.env.META_API_VERSION || DEFAULT_API_VERSION;

  if (!accessToken) {
    throw new MetaConfigurationError("Missing META_ACCESS_TOKEN environment variable.");
  }
  if (!adAccountIdRaw) {
    throw new MetaConfigurationError("Missing META_AD_ACCOUNT_ID environment variable.");
  }

  // Format ad account ID to ensure it is prefixed with 'act_'
  let adAccountId = adAccountIdRaw.trim();
  if (!adAccountId.startsWith("act_")) {
    adAccountId = `act_${adAccountId}`;
  }

  return {
    accessToken: accessToken.trim(),
    adAccountId,
    businessId: businessId?.trim(),
    pageId: pageId?.trim(),
    pixelId: pixelId?.trim(),
    appId: appId?.trim(),
    appSecret: appSecret?.trim(),
    apiVersion: apiVersion.trim(),
  };
}

/**
 * Maps Meta API Error codes to structured typed exceptions.
 */
function handleMetaApiError(errorObj, httpStatus) {
  const message = errorObj?.message || "An unknown Meta API error occurred.";
  const code = errorObj?.code;
  const subcode = errorObj?.error_subcode;

  console.error(`[Meta API Error Response] Status: ${httpStatus}, Code: ${code}, Subcode: ${subcode}, Msg: ${message}`);

  // Authentication Issues
  if (code === 190 || subcode === 460 || subcode === 463 || subcode === 467) {
    return new MetaAuthenticationError(`Authentication failed: ${message}`);
  }

  // Permission Issues
  if (code === 10 || code === 200 || code === 283 || (code >= 200 && code <= 299)) {
    return new MetaPermissionError(`Permission denied: ${message}`);
  }

  // Rate Limiting
  if (code === 4 || code === 17 || code === 32 || code === 613) {
    return new MetaRateLimitError(`Meta API rate limit exceeded: ${message}`);
  }

  // Validation Issues
  if (code === 100 || code === 2635 || httpStatus === 400) {
    return new MetaValidationError(`Validation error: ${message}`);
  }

  return new MetaApiError(message, `META_API_ERROR_${code || "UNKNOWN"}`, httpStatus);
}

/**
 * Safe delay helper for retries.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic request wrapper supporting validation, caching, timeouts, retries, and error mapping.
 */
export async function fetchMeta(endpoint, options = {}) {
  const config = getMetaConfig();
  const { params = {}, noCache = false } = options;

  // Build full request URL with API version and access token
  const urlPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const queryParams = new URLSearchParams(params);
  queryParams.set("access_token", config.accessToken);

  const fullUrl = `${BASE_URL}/${config.apiVersion}${urlPath}?${queryParams.toString()}`;
  
  // Create cache key (endpoint + stringified params, excluding accessToken)
  const safeParams = { ...params };
  const cacheKey = `${urlPath}:${JSON.stringify(safeParams)}`;

  // Serve from cache if available and not expired
  if (!noCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  let retries = 3;
  let attempt = 0;
  let backoffMs = 500;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const startTime = Date.now();

    try {
      attempt++;
      const response = await fetch(fullUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
        },
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      console.log(`[Meta API Request] GET ${urlPath} | Status: ${response.status} | Duration: ${duration}ms | Attempt: ${attempt}`);

      // Handle successful responses
      if (response.ok) {
        const data = await response.json();
        
        // Cache successful responses
        if (!noCache) {
          memoryCache.set(cacheKey, { data, timestamp: Date.now() });
        }
        return data;
      }

      const errorData = await response.json().catch(() => null);
      const metaErrorObj = errorData?.error;

      // Handle transient errors for retry logic
      const isTransient =
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504 ||
        metaErrorObj?.code === 4 ||
        metaErrorObj?.code === 17 ||
        metaErrorObj?.code === 613;

      if (isTransient && attempt <= retries) {
        console.warn(`[Meta API Transient Error] Status: ${response.status}. Retrying in ${backoffMs}ms...`);
        await delay(backoffMs);
        backoffMs *= 2;
        continue;
      }

      // If not transient or retries exhausted, parse and throw
      throw handleMetaApiError(metaErrorObj, response.status);

    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err.name === "AbortError") {
        if (attempt <= retries) {
          console.warn(`[Meta API Timeout] Endpoint: ${urlPath}. Retrying in ${backoffMs}ms...`);
          await delay(backoffMs);
          backoffMs *= 2;
          continue;
        }
        throw new MetaNetworkError(`Meta API request timed out after ${TIMEOUT_MS / 1000}s.`);
      }

      // Keep retrying on generic network errors
      if (err instanceof TypeError && attempt <= retries) {
        console.warn(`[Meta API Network Failure] Endpoint: ${urlPath}. Retrying in ${backoffMs}ms...`);
        await delay(backoffMs);
        backoffMs *= 2;
        continue;
      }

      // If it is already a structured MetaError, rethrow it
      if (err instanceof MetaError) {
        throw err;
      }

      // Wrap other network/runtime issues
      throw new MetaNetworkError(`Network connection failed: ${err.message}`);
    }
  }

  throw new MetaNetworkError("Meta API request failed after maximum retries.");
}
