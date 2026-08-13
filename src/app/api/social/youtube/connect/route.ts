import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { requireRole } from "@/lib/rbac";
import { buildYoutubeAuthUrl } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  await requireRole("INFLUENCER");

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("youtube_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });

  const redirectUri = new URL("/api/social/youtube/callback", request.url).toString();
  return NextResponse.redirect(buildYoutubeAuthUrl(redirectUri, state));
}
