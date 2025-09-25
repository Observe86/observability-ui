/**
 * Used to get a cookie on the server side.
 */
export function getCookie(name: string, request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );

  return cookies[name] || null;
}
