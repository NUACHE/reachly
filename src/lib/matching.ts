export interface MatchInput {
  campaignNiches: string[];
  minFollowers: number;
  maxFollowers: number;
  influencerNiches: string[];
  followerCount: number;
  engagementRate: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function nicheOverlapScore(campaignNiches: string[], influencerNiches: string[]): number {
  if (campaignNiches.length === 0) return 0;
  const influencerSet = new Set(influencerNiches);
  const overlap = campaignNiches.filter((niche) => influencerSet.has(niche)).length;
  return clamp((overlap / campaignNiches.length) * 100, 0, 100);
}

export function audienceFitScore(followerCount: number, minFollowers: number, maxFollowers: number): number {
  if (followerCount >= minFollowers && followerCount <= maxFollowers) return 100;

  if (followerCount < minFollowers) {
    const denominator = Math.max(minFollowers, 1);
    const distance = (minFollowers - followerCount) / denominator;
    return clamp(100 * (1 - distance), 0, 100);
  }

  const denominator = Math.max(maxFollowers, 1);
  const distance = (followerCount - maxFollowers) / denominator;
  return clamp(100 * (1 - distance), 0, 100);
}

export function engagementScore(engagementRate: number): number {
  if (engagementRate >= 5) return 100;
  if (engagementRate >= 2) return 70;
  return 40;
}

/**
 * Weights (0.5 / 0.3 / 0.2) are a documented assumption (see System_Design.md §5),
 * not derived from outcome data — a candidate for future tuning.
 */
export function computeMatchScore(input: MatchInput): number {
  const niche = nicheOverlapScore(input.campaignNiches, input.influencerNiches);
  const audience = audienceFitScore(input.followerCount, input.minFollowers, input.maxFollowers);
  const engagement = engagementScore(input.engagementRate);

  const score = 0.5 * niche + 0.3 * audience + 0.2 * engagement;
  return Math.round(clamp(score, 0, 100));
}
