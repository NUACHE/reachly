import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { exchangeCodeForTokens } from "@/lib/youtube";
import { syncYoutubeAccount } from "@/lib/social";

export async function GET(request: NextRequest) {
  const user = await requireRole("INFLUENCER");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("youtube_oauth_state")?.value;
  cookieStore.delete("youtube_oauth_state");

  if (oauthError) {
    return NextResponse.redirect(new URL(`/influencer/profile?tab=connected&social_error=${encodeURIComponent(oauthError)}`, request.url));
  }
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/influencer/profile?tab=connected&social_error=invalid_state", request.url));
  }

  try {
    const redirectUri = new URL("/api/social/youtube/callback", request.url).toString();
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    const influencer = await prisma.influencerProfile.findUniqueOrThrow({ where: { userId: user.id } });

    const account = await prisma.socialAccount.upsert({
      where: { influencerId_platform: { influencerId: influencer.id, platform: "YOUTUBE" } },
      create: {
        influencerId: influencer.id,
        platform: "YOUTUBE",
        externalAccountId: "pending",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    });

    await syncYoutubeAccount(account.id);

    return NextResponse.redirect(new URL("/influencer/profile?tab=connected&connected=youtube", request.url));
  } catch (err) {
    console.error("YouTube connect failed", err);
    return NextResponse.redirect(new URL("/influencer/profile?tab=connected&social_error=connect_failed", request.url));
  }
}
