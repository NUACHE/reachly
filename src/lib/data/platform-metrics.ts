import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export interface PlatformMetricPoint {
  label: string;
  reach: number;
  engagement: number;
}

/** Buckets real synced-post views (reach) and likes+comments (engagement) by day. No real impressions source exists yet. */
export async function buildDailyPlatformMetrics(where: Prisma.SocialPostWhereInput): Promise<PlatformMetricPoint[]> {
  const posts = await prisma.socialPost.findMany({
    where,
    select: { postedAt: true, views: true, likes: true, comments: true },
    orderBy: { postedAt: "asc" },
  });

  const byDay = new Map<string, { reach: number; engagement: number }>();
  for (const post of posts) {
    const key = post.postedAt.toISOString().slice(0, 10);
    const entry = byDay.get(key) ?? { reach: 0, engagement: 0 };
    entry.reach += post.views;
    entry.engagement += post.likes + post.comments;
    byDay.set(key, entry);
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      label: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      reach: value.reach,
      engagement: value.engagement,
    }));
}
