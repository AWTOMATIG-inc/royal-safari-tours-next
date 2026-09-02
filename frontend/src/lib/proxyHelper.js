/**
 * Extracts and returns authentication and cookie headers from an incoming Next.js Request
 * to forward them directly to the Express backend.
 *
 * @param {Request} request
 * @param {Record<string, string>} extraHeaders
 * @returns {Record<string, string>}
 */
export function getForwardHeaders(request, extraHeaders = {}) {
  const headers = { ...extraHeaders };

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers["authorization"] = authHeader;
  }

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
  }

  const tokenHeader = request.headers.get("x-access-token");
  if (tokenHeader) {
    headers["x-access-token"] = tokenHeader;
  }

  return headers;
}
