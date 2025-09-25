import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

import { getCookie } from "../utils/cookie";

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale = pathSegments[0];

  const accessToken = getCookie("accessToken", request);

  // If the user is trying to access the login page and has an access token, redirect to the home page.
  if (pathname === `/${locale}/login` && accessToken) {
    const newUrl = new URL(`/${locale}/application/home`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // If the user is trying to access any page that requires authentication ('application' page) and has no access token,
  // or the access token does not contain a Company ID and a User ID, redirect to the login page
  if (pathname.startsWith(`/${locale}/application`)) {
    if (!accessToken) {
      const newUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(newUrl);
    }

    const decoded = jwtDecode(accessToken) as any;
    if (!decoded.companyId || !decoded.userId) {
      const newUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(newUrl);
    }
  }
}
