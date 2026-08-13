import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { computeMatchScore } from "@/lib/matching";
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

/** No KPI-to-post linkage exists yet, so progress is an honest 100 once completed and 0 otherwise. */
export async function getInfluencerJoinedCampaigns(_influencerId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const applications = await prisma.application.findMany({
    where: { influencerId: influencer.id, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { campaign: true },
  });

  return applications.map((application) => ({
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
    kpiProgress: application.status === "COMPLETED" ? 100 : 0,
  }));
}

/**
 * Points earned for every campaign this influencer has been accepted into — a simple,
 * disclosed placeholder formula (5% of campaign budget), not a real payout ledger. Framed
 * as redeemable points rather than a cash balance until a real payment/redemption model
 * ships (Technical_Debt_Plan DEBT-07).
 */
export async function getInfluencerPoints(_influencerId: string) {
  const influencer = await getCurrentInfluencerProfile();

  const applications = await prisma.application.findMany({
    where: { influencerId: influencer.id, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { campaign: true },
  });

  const earned = applications.reduce((sum, application) => sum + application.campaign.budget * 0.05, 0);
  return Math.round(earned);
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
