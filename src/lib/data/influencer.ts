import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { computeMatchScore } from "@/lib/matching";
import { summarizePoints } from "@/lib/points";
import { kpiProgressPercent } from "@/lib/kpi";
import { toMockCampaign } from "@/lib/data/campaigns";
import type { MockAlert } from "@/lib/mock-data";

export async function getCurrentInfluencerProfile() {
  const user = await requireRole("INFLUENCER");
  const influencer = await prisma.influencerProfile.findUnique({ where: { userId: user.id } });
  if (!influencer) throw new Error("Influencer profile not found for this account.");
  return influencer;
}

export async function getInfluencerProfile(_influencerId: string) {
  return getCurrentInfluencerProfile();
}

export async function getOpenCampaignsForInfluencer(_influencerId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const [campaigns, applications] = await Promise.all([
    prisma.campaign.findMany({ where: { status: "OPEN" } }),
    prisma.application.findMany({ where: { influencerId: influencer.id }, select: { campaignId: true } }),
  ]);

  const applied = new Set(applications.map((a) => a.campaignId));

  return campaigns
    .map((campaign) => ({
      ...toMockCampaign(campaign),
      matchScore: computeMatchScore({
        campaignNiches: campaign.niches,
        influencerNiches: influencer.niches,
        minFollowers: campaign.minFollowers,
        maxFollowers: campaign.maxFollowers,
        followerCount: influencer.followerCount,
        engagementRate: influencer.engagementRate,
      }),
      alreadyApplied: applied.has(campaign.id),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function getInfluencerApplications(_influencerId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const applications = await prisma.application.findMany({
    where: { influencerId: influencer.id },
    include: { campaign: true },
    orderBy: { matchScore: "desc" },
  });

  return applications.map((application) => ({
    id: application.id,
    campaignId: application.campaignId,
    note: application.note ?? "",
    matchScore: application.matchScore,
    status: application.status,
    appliedAt: application.appliedAt.toISOString().slice(0, 10),
    campaign: toMockCampaign(application.campaign),
  }));
}

/**
 * `kpiProgress` is real: actual synced views/likes for this application against the
 * campaign's targetViews/targetLikes (kpiProgressPercent), not the old binary "0% until
 * COMPLETED, then 100%". `points` (plus its `pointsViews`/`pointsEngagement` breakdown) is
 * earned from the same synced posts via `summarizePoints` — deliberately independent of
 * campaign budget, so it's not a real payout ledger, but it does reflect genuine audience
 * reach rather than an arbitrary cut of what the brand paid (Technical_Debt_Plan
 * DEBT-07/DEBT-12).
 */
export async function getInfluencerJoinedCampaigns(_influencerId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const applications = await prisma.application.findMany({
    where: { influencerId: influencer.id, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { campaign: true, socialPosts: { select: { views: true, likes: true, comments: true } } },
  });

  return applications.map((application) => {
    const { views, engagement, points } = summarizePoints(application.socialPosts);
    const likes = application.socialPosts.reduce((sum, post) => sum + post.likes, 0);
    const kpiProgress = kpiProgressPercent(
      { views, likes },
      { targetViews: application.campaign.targetViews, targetLikes: application.campaign.targetLikes },
    );

    return {
      application: {
        id: application.id,
        campaignId: application.campaignId,
        note: application.note ?? "",
        matchScore: application.matchScore,
        status: application.status,
        appliedAt: application.appliedAt.toISOString().slice(0, 10),
        decidedAt: (application.decidedAt ?? application.appliedAt).toISOString(),
      },
      campaign: toMockCampaign(application.campaign),
      kpiProgress,
      points,
      pointsViews: views,
      pointsEngagement: engagement,
    };
  });
}

/** Real posts from a connected social account that were auto-matched to this campaign during sync (hashtag matching in social.ts). */
export async function getCampaignPostsForInfluencer(campaignId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const application = await prisma.application.findUnique({
    where: { campaignId_influencerId: { campaignId, influencerId: influencer.id } },
  });
  if (!application) return [];

  const posts = await prisma.socialPost.findMany({
    where: { applicationId: application.id },
    include: { socialAccount: { select: { platform: true } } },
    orderBy: { postedAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    platform: post.socialAccount.platform,
    title: post.title,
    url: post.url,
    postedAt: post.postedAt,
    views: post.views,
    likes: post.likes,
    comments: post.comments,
  }));
}

export async function getInfluencerAlerts(_influencerId: string): Promise<MockAlert[]> {
  const influencer = await getCurrentInfluencerProfile();

  const notifications = await prisma.notification.findMany({
    where: { userId: influencer.userId },
    orderBy: { createdAt: "desc" },
  });

  return notifications.map((notification) => ({
    id: notification.id,
    icon: notification.type === "CAMPAIGN_INVITE" ? "mail" : "bell",
    title: notification.title,
    description: notification.message,
    badge:
      notification.type === "APPLICATION_ACCEPTED"
        ? "Accepted"
        : notification.type === "APPLICATION_REJECTED"
          ? "Declined"
          : undefined,
  }));
}

export async function getSocialAccountsForInfluencer() {
  const influencer = await getCurrentInfluencerProfile();

  const accounts = await prisma.socialAccount.findMany({
    where: { influencerId: influencer.id },
    include: { posts: { orderBy: { postedAt: "desc" }, take: 5 } },
    orderBy: { connectedAt: "asc" },
  });

  return accounts.map((account) => ({
    id: account.id,
    platform: account.platform,
    username: account.username,
    displayName: account.displayName,
    followerCount: account.followerCount,
    lastSyncedAt: account.lastSyncedAt,
    posts: account.posts,
  }));
}
