import { NextRequest, NextResponse } from "next/server";

export function defaultTabRedirectionMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale = pathSegments[0];

  // Default tab for company-settings page
  if (pathname == `/${locale}/application/company-settings`) {
    const newUrl = new URL(`/${locale}/application/company-settings/general`, request.url);
    return NextResponse.redirect(newUrl);
  }
}
