export interface PlatformMeta {
  key: string;
  short: string;
  color: string;
}

export const PLATFORMS: PlatformMeta[] = [
  { key: "Facebook", short: "f", color: "bg-blue-600" },
  { key: "Instagram", short: "IG", color: "bg-pink-500" },
  { key: "TikTok", short: "TT", color: "bg-black" },
  { key: "Twitter", short: "X", color: "bg-sky-500" },
  { key: "YouTube", short: "YT", color: "bg-red-600" },
  { key: "LinkedIn", short: "in", color: "bg-blue-700" },
];

/** Maps a SocialPlatform enum value (e.g. "YOUTUBE") to its display metadata (e.g. key "YouTube"). */
export function platformMetaForEnum(platform: string): PlatformMeta | undefined {
  return PLATFORMS.find((p) => p.key.toUpperCase() === platform.toUpperCase());
}

export interface PlatformStat {
  platform: PlatformMeta;
  followers: number;
  costPerPost: number;
}

/**
 * Deterministic per-platform follower split + cost-per-post, purely for display —
 * no live rate card or per-platform follower breakdown exists in the data model yet.
 */
export function platformBreakdownFor(followerCount: number): PlatformStat[] {
  const split = [0.55, 0.3, 0.1];
  return PLATFORMS.slice(0, 3).map((platform, i) => ({
    platform,
    followers: Math.round(followerCount * split[i]),
    costPerPost: Math.round(followerCount * split[i] * 0.0008 * 100) / 100,
  }));
}
