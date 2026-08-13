import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { toMockCampaign } from "@/lib/data/campaigns";
import { buildDailyPlatformMetrics, type PlatformMetricPoint } from "@/lib/data/platform-metrics";

export async function getCurrentBrandProfile() {
  const user = await requireRole("BRAND");
  const brand = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
  if (!brand) throw new Error("Brand profile not found for this account.");
  return brand;
}

export async function getBrandProfile() {
  return getCurrentBrandProfile();
}

export async function getBrandCampaigns() {
  const brand = await getCurrentBrandProfile();
  const campaigns = await prisma.campaign.findMany({ where: { brandId: brand.id }, orderBy: { createdAt: "desc" } });
  return campaigns.map(toMockCampaign);
}

/** Spend, campaign, and influencer-roster totals for the brand dashboard's stat cards. No historical snapshots exist yet, so trends are omitted rather than fabricated. */
export async function getBrandOverviewStats() {
  const brand = await getCurrentBrandProfile();
  const campaigns = await prisma.campaign.findMany({ where: { brandId: brand.id } });

  const spentByStatus = { OPEN: 0, ACTIVE: 1, CLOSED: 0.5, COMPLETED: 1 };
  const totalSpend = campaigns.reduce((sum, c) => sum + c.budget * spentByStatus[c.status], 0);

  const acceptedInfluencers = await prisma.application.findMany({
    where: { campaign: { brandId: brand.id }, status: { in: ["ACCEPTED", "COMPLETED"] } },
    select: { influencerId: true },
    distinct: ["influencerId"],
  });

  return {
    totalSpend,
    totalSpendTrend: undefined,
    avgCampaignSpend: campaigns.length ? Math.round(totalSpend / campaigns.length) : 0,
    avgCampaignSpendTrend: undefined,
    campaignCount: campaigns.length,
    campaignCountTrend: undefined,
    influencerCount: acceptedInfluencers.length,
    influencerCountTrend: undefined,
  };
}

/** No post/metrics model exists yet — the Overview panel shows honest zeros until that lands. */
export async function getBrandPerformanceOverview() {
  await getCurrentBrandProfile();
  return { reach: 0, engagement: 0, impressions: 0 };
}

export async function getBrandPlatformMetrics(): Promise<PlatformMetricPoint[]> {
  const brand = await getCurrentBrandProfile();
  return buildDailyPlatformMetrics({ application: { campaign: { brandId: brand.id } } });
}

export async function getTeamMembers() {
  const brand = await getCurrentBrandProfile();
  return prisma.teamMember.findMany({ where: { brandId: brand.id }, orderBy: { createdAt: "asc" } });
}

/** Reach/engagement are summed from each influencer's real synced social posts linked across this brand's campaigns. Impressions/spend stay honest zeros. */
export async function getBrandInfluencerPerformance() {
  const brand = await getCurrentBrandProfile();
  const applications = await prisma.application.findMany({
    where: { campaign: { brandId: brand.id }, status: { in: ["ACCEPTED", "COMPLETED"] } },
    include: { influencer: true, socialPosts: { select: { views: true, likes: true, comments: true } } },
  });

  const byInfluencer = new Map<string, { id: string; name: string; engagement: number; reach: number; impressions: number; totalSpent: number }>();
  for (const application of applications) {
    const reach = application.socialPosts.reduce((sum, post) => sum + post.views, 0);
    const engagement = application.socialPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);
    const existing = byInfluencer.get(application.influencerId);
    if (existing) {
      existing.reach += reach;
      existing.engagement += engagement;
    } else {
      byInfluencer.set(application.influencerId, {
        id: application.influencer.id,
        name: application.influencer.displayName,
        engagement,
        reach,
        impressions: 0,
        totalSpent: 0,
      });
    }
  }

  return Array.from(byInfluencer.values());
}

const SOCIAL_ACCOUNT_SELECT = {
  id: true,
  platform: true,
  username: true,
  displayName: true,
  followerCount: true,
  lastSyncedAt: true,
} as const;

export async function getInfluencerDirectory() {
  await getCurrentBrandProfile();
  const influencers = await prisma.influencerProfile.findMany({
    orderBy: { displayName: "asc" },
    include: { socialAccounts: { select: SOCIAL_ACCOUNT_SELECT } },
  });
  return influencers.map((influencer) => ({ ...influencer, bio: influencer.bio ?? "" }));
}

export async function getInfluencerProfile(influencerId: string) {
  await getCurrentBrandProfile();
  const influencer = await prisma.influencerProfile.findUnique({
    where: { id: influencerId },
    include: {
      socialAccounts: {
        select: {
          ...SOCIAL_ACCOUNT_SELECT,
          posts: {
            orderBy: { postedAt: "desc" },
            take: 4,
            select: { id: true, title: true, url: true, views: true, likes: true, comments: true, postedAt: true },
          },
        },
      },
    },
  });
  return influencer ? { ...influencer, bio: influencer.bio ?? "" } : null;
}
