import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

const ROLE_HOME: Record<Role, string> = {
  BRAND: "/brand",
  INFLUENCER: "/influencer",
  ADMIN: "/admin",
};

/**
 * First line of defence only (fast redirect for UX). The authoritative checks
 * live in requireUser/requireRole (src/lib/rbac.ts) inside each Server Action
 * and Route Handler, per Next.js's own guidance that Proxy coverage can silently
 * regress if a matcher or route is refactored.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  const isBrandRoute = pathname.startsWith("/brand");
  const isInfluencerRoute = pathname.startsWith("/influencer");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isBrandRoute || isInfluencerRoute || isAdminRoute) && !session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user) {
    const wrongSection =
      (isBrandRoute && session.user.role !== "BRAND") ||
      (isInfluencerRoute && session.user.role !== "INFLUENCER") ||
      (isAdminRoute && session.user.role !== "ADMIN");

    if (wrongSection) {
      return NextResponse.redirect(new URL(ROLE_HOME[session.user.role], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/brand/:path*", "/influencer/:path*", "/admin/:path*"],
};
