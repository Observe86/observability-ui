/**
 * We store the access token in a cookie to be able to check for it on the server side
 * in the middleware.ts file. This is necessary for redirection and route protection.
 *
 * If we store the access token in the browser's local storage, session storage, or in-memory (e.g. React context),
 * we won't be able to access it on the server side.
 */

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const accessToken = "accessToken";

export function storeAccessToken(token: string): void {
  try {
    const decoded: { exp: number } = jwtDecode(token);

    if (!decoded.exp) {
      throw new Error("Token does not have an expiration claim.");
    }

    Cookies.set(accessToken, token, {
      // removed the expiration of the cookie itself so that we still have a token
      // (even if expired) which is necessary for the proper flow of requests to refresh the token
      // expires: new Date(decoded.exp * 1000),
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  } catch (error) {
    console.error("Failed to store access token:", error);
    throw new Error("Invalid token provided.");
  }
}

export function getAccessToken(): string | null {
  return Cookies.get(accessToken) || null;
}

export function clearAccessToken(): void {
  Cookies.remove(accessToken, { path: "/" });
}
