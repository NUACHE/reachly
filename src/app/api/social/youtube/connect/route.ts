import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireRole } from "@/lib/rbac";
import { buildYoutubeAuthUrl } from "@/lib/youtube";
import { getAppUrl } from "@/lib/app-url";

export async function GET() {
  await requireRole("INFLUENCER");

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("youtube_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });

  const redirectUri = new URL("/api/social/youtube/callback", getAppUrl()).toString();
  return NextResponse.redirect(buildYoutubeAuthUrl(redirectUri, state));
}
