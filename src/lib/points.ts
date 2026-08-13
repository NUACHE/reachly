export interface EngagementCounts {
  views: number;
  likes: number;
  comments: number;
}

export const POINTS_PER_VIEW = 0.1;
export const POINTS_PER_ENGAGEMENT = 0.5;

export interface PointsSummary {
  views: number;
  engagement: number;
  points: number;
}

/**
 * Points earned from a set of synced social posts linked to a campaign application.
 * Weighted toward reach (views) with a smaller per-engagement (like/comment) bonus —
 * deliberately budget-independent, so a small-budget campaign with strong real
 * engagement still earns meaningfully more than a big-budget one nobody watched.
 */
export function summarizePoints(posts: EngagementCounts[]): PointsSummary {
  const views = posts.reduce((sum, post) => sum + post.views, 0);
  const engagement = posts.reduce((sum, post) => sum + post.likes + post.comments, 0);
  const points = Math.round(views * POINTS_PER_VIEW + engagement * POINTS_PER_ENGAGEMENT);
  return { views, engagement, points };
}

export function pointsForPosts(posts: EngagementCounts[]): number {
  return summarizePoints(posts).points;
}
