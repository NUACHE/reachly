import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { relativeTimeFrom } from "@/lib/dates";
import { buildDailyPlatformMetrics, type PlatformMetricPoint } from "@/lib/data/platform-metrics";
import type { Campaign } from "@/generated/prisma/client";
import type {
  CampaignPostingScheduleItem,
  MockActivityItem,
  MockApplication,
  MockCampaign,
  MockInfluencer,
} from "@/lib/mock-data";

export function toMockCampaign(campaign: Campaign): MockCampaign {
  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    niches: campaign.niches,
    minFollowers: campaign.minFollowers,
    maxFollowers: campaign.maxFollowers,
    budget: campaign.budget,
    deliverables: campaign.deliverables,
    status: campaign.status,
    deadline: campaign.deadline.toISOString().slice(0, 10),
    objective: campaign.objective,
    targetViews: campaign.targetViews,
    targetLikes: campaign.targetLikes,
    dos: campaign.dos,
    donts: campaign.donts,
    hashtags: campaign.hashtags,
    postingSchedule: (campaign.postingSchedule as CampaignPostingScheduleItem[] | null) ?? undefined,
  };
}

export async function getCampaignById(campaignId: string): Promise<MockCampaign | null> {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  return campaign ? toMockCampaign(campaign) : null;
}

async function requireOwnedCampaign(campaignId: string) {
  const user = await requireRole("BRAND");
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return null;

  const brand = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
  if (!brand || campaign.brandId !== brand.id) return null;

  return campaign;
}

export async function getApplicationsForCampaign(campaignId: string): Promise<MockApplication[]> {
  const campaign = await requireOwnedCampaign(campaignId);
  if (!campaign) return [];

  const applications = await prisma.application.findMany({
    where: { campaignId },
    include: { influencer: { include: { socialAccounts: { select: { id: true, platform: true, followerCount: true } } } } },
    orderBy: { matchScore: "desc" },
  });

  return applications.map((application) => ({
    id: application.id,
    campaignId: application.campaignId,
    influencer: toMockInfluencer(application.influencer),
    note: application.note ?? "",
    matchScore: application.matchScore,
    status: application.status,
    appliedAt: application.appliedAt.toISOString().slice(0, 10),
  }));
}

/**
 * Reach/engagements come from real synced social posts linked to this campaign's applications
 * (views as a reach proxy, likes+comments as engagement). Impressions/spend stay honest zeros —
 * no data source for those exists yet.
 */
export async function getCampaignMetrics(campaignId: string) {
  const campaign = await requireOwnedCampaign(campaignId);
  if (!campaign) return { engagements: 0, reach: 0, impressions: 0, totalInfluencers: 0, totalPublishedPosts: 0, totalSpend: 0 };

  const [acceptedCount, socialPosts] = await Promise.all([
    prisma.application.count({ where: { campaignId, status: { in: ["ACCEPTED", "COMPLETED"] } } }),
    prisma.socialPost.findMany({ where: { application: { campaignId } }, select: { views: true, likes: true, comments: true } }),
  ]);

  const reach = socialPosts.reduce((sum, post) => sum + post.views, 0);
  const engagements = socialPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);

  return {
    engagements,
    reach,
    impressions: 0,
    totalInfluencers: acceptedCount,
    totalPublishedPosts: socialPosts.length,
    totalSpend: 0,
  };
}

export async function getCampaignPlatformMetrics(campaignId: string): Promise<PlatformMetricPoint[]> {
  const campaign = await requireOwnedCampaign(campaignId);
  if (!campaign) return [];
  return buildDailyPlatformMetrics({ application: { campaignId } });
}

export async function getCampaignActivity(campaignId: string): Promise<MockActivityItem[]> {
  const campaign = await requireOwnedCampaign(campaignId);
  if (!campaign) return [];

  const applications = await prisma.application.findMany({
    where: { campaignId },
    include: { influencer: true },
    orderBy: { appliedAt: "desc" },
    take: 10,
  });

  const items: (MockActivityItem & { at: Date })[] = [];
  for (const application of applications) {
    items.push({
      id: `${application.id}-applied`,
      influencerName: application.influencer.displayName,
      action: "applied to the campaign",
      timeAgo: relativeTimeFrom(application.appliedAt),
      at: application.appliedAt,
    });
    if (application.decidedAt) {
      const action =
        application.status === "ACCEPTED"
          ? "was accepted"
          : application.status === "REJECTED"
            ? "was declined"
            : "completed the campaign";
      items.push({
        id: `${application.id}-decided`,
        influencerName: application.influencer.displayName,
        action,
        timeAgo: relativeTimeFrom(application.decidedAt),
        at: application.decidedAt,
      });
    }
  }

  return items
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8)
    .map(({ at: _at, ...item }) => item);
}

/** Reach/engagement come from each influencer's real synced social posts linked to this campaign. Impressions/spend stay honest zeros. */
export async function getCampaignInfluencerPerformance(campaignId: string) {
  const campaign = await requireOwnedCampaign(campaignId);
  if (!campaign) return [];

  const applications = await prisma.application.findMany({
    where: { campaignId, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { influencer: true, socialPosts: { select: { views: true, likes: true, comments: true } } },
  });

  return applications.map((application) => ({
    id: application.influencer.id,
    name: application.influencer.displayName,
    engagement: application.socialPosts.reduce((sum, post) => sum + post.likes + post.comments, 0),
    reach: application.socialPosts.reduce((sum, post) => sum + post.views, 0),
    impressions: 0,
    totalSpent: 0,
  }));
}

function toMockInfluencer(influencer: {
  id: string;
  displayName: string;
  niches: string[];
  followerCount: number;
  engagementRate: number;
  bio: string | null;
  socialAccounts?: { id: string; platform: string; followerCount: number }[];
}): MockInfluencer {
  return {
    id: influencer.id,
    displayName: influencer.displayName,
    niches: influencer.niches,
    followerCount: influencer.followerCount,
    engagementRate: influencer.engagementRate,
    bio: influencer.bio ?? "",
    socialAccounts: influencer.socialAccounts,
  };
}
