import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./middleware/auth-middleware";
import { defaultTabRedirectionMiddleware } from "./middleware/default-tab-redirection-middleware";
import { localeMiddleware } from "./middleware/locale-middleware";

const middlewares = [localeMiddleware, authMiddleware, defaultTabRedirectionMiddleware];

export function middleware(request: NextRequest) {
  for (const mw of middlewares) {
    const response = mw(request);

    if (response) {
      return response; // Stop execution only if middleware returns a response
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, etc.)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/',
  ],
};
