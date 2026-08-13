import { prisma } from "@/lib/prisma";
import { fetchRecentYoutubeVideos, fetchYoutubeChannel, refreshAccessToken } from "@/lib/youtube";
import type { YoutubeVideo } from "@/lib/youtube";
import type { SocialAccount, SocialPlatform } from "@/generated/prisma/client";
import type { CampaignPostingScheduleItem } from "@/lib/mock-data";

/** Returns a usable access token for this account, refreshing it first if it's expired or about to expire. */
async function getValidAccessToken(account: SocialAccount): Promise<string> {
  const expiresSoon = account.tokenExpiresAt && account.tokenExpiresAt.getTime() < Date.now() + 60_000;
  if (!expiresSoon) return account.accessToken;

  if (!account.refreshToken) throw new Error("This connection has expired and needs to be reconnected.");

  const tokens = await refreshAccessToken(account.refreshToken);
  await prisma.socialAccount.update({
    where: { id: account.id },
    data: {
      accessToken: tokens.access_token,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });
  return tokens.access_token;
}

/** Campaigns whose posting schedule includes this platform, for an influencer's accepted/completed applications. */
async function getEligibleApplications(influencerId: string, platform: SocialPlatform) {
  const applications = await prisma.application.findMany({
    where: { influencerId, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { campaign: true },
    orderBy: { decidedAt: "desc" },
  });

  return applications.filter((application) => {
    const schedule = (application.campaign.postingSchedule as CampaignPostingScheduleItem[] | null) ?? [];
    return schedule.some((item) => item.platform.toUpperCase() === platform);
  });
}

type EligibleApplication = Awaited<ReturnType<typeof getEligibleApplications>>[number];

function normalizeTag(tag: string) {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

function extractHashtags(text: string) {
  const matches = text.match(/#\w+/g) ?? [];
  return new Set(matches.map((tag) => tag.slice(1).toLowerCase()));
}

/**
 * Match a synced video to the campaign it's "for", in priority order:
 * 1. A campaign hashtag appears in the video's title/description — precise and unambiguous.
 * 2. Exactly one eligible campaign exists — nothing to guess wrong on.
 * Otherwise, no match: with several eligible campaigns and no hashtag, guessing would likely be wrong.
 */
function matchApplicationToVideo(eligible: EligibleApplication[], video: Pick<YoutubeVideo, "title" | "description">) {
  const videoTags = extractHashtags(`${video.title} ${video.description}`);
  if (videoTags.size > 0) {
    const hashtagMatch = eligible.find((application) => application.campaign.hashtags.some((tag) => videoTags.has(normalizeTag(tag))));
    if (hashtagMatch) return hashtagMatch;
  }

  return eligible.length === 1 ? eligible[0] : undefined;
}

/** Pulls fresh channel + recent-video stats from YouTube and upserts them onto the given account. */
export async function syncYoutubeAccount(accountId: string) {
  const account = await prisma.socialAccount.findUniqueOrThrow({
    where: { id: accountId },
    include: { influencer: { select: { userId: true } } },
  });
  const accessToken = await getValidAccessToken(account);

  const [channel, videos] = await Promise.all([fetchYoutubeChannel(accessToken), fetchRecentYoutubeVideos(accessToken)]);

  await prisma.socialAccount.update({
    where: { id: account.id },
    data: {
      externalAccountId: channel.externalAccountId,
      followerCount: channel.followerCount,
      displayName: channel.displayName,
      username: channel.username,
      lastSyncedAt: new Date(),
    },
  });

  const eligibleApplications = await getEligibleApplications(account.influencerId, account.platform);

  for (const { description, ...video } of videos) {
    const existing = await prisma.socialPost.findUnique({
      where: { socialAccountId_externalPostId: { socialAccountId: account.id, externalPostId: video.externalPostId } },
    });

    const matchedApplication = matchApplicationToVideo(eligibleApplications, { title: video.title, description });

    await prisma.socialPost.upsert({
      where: { socialAccountId_externalPostId: { socialAccountId: account.id, externalPostId: video.externalPostId } },
      create: { socialAccountId: account.id, applicationId: matchedApplication?.id, ...video },
      update: { views: video.views, likes: video.likes, comments: video.comments, fetchedAt: new Date() },
    });

    if (!existing && matchedApplication) {
      await prisma.notification.create({
        data: {
          userId: account.influencer.userId,
          type: "POST_LINKED",
          title: "Post counted toward campaign",
          message: `Your YouTube post "${video.title}" was counted toward "${matchedApplication.campaign.title}".`,
          link: `/influencer/campaigns/${matchedApplication.campaignId}`,
        },
      });
    }
  }
}
