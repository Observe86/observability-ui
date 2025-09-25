import { NextRequest, NextResponse } from "next/server";

import { i18n } from "../i18n/config";

export function localeMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale = pathSegments[0];

  // If the user is trying to access just `/`, redirect to default locale's `/login`
  if (pathname === "/") {
    const newUrl = new URL(`/${i18n.defaultLocale}/login`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // If the user goes to a supported locale e.g. `/en` (without `/login`), redirect to `/en/login`
  if (i18n.supportedLocales.includes(locale) && pathSegments.length === 1) {
    const newUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // If locale is not supported e.g. `/it`, redirect to default locale's `/login`
  if (!i18n.supportedLocales.includes(locale)) {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");
    const newUrl = new URL(
      `/${i18n.defaultLocale}${pathnameWithoutLocale || "/login"}`, // append /login if no path
      request.url,
    );
    return NextResponse.redirect(newUrl);
  }
}
