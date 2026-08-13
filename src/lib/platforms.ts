export interface PlatformMeta {
  key: string;
  short: string;
  color: string;
}

/** YouTube is the only supported platform — see SRS §2.4 and Technical_Debt_Plan DEBT-10. */
export const PLATFORMS: PlatformMeta[] = [{ key: "YouTube", short: "YT", color: "bg-red-600" }];

/** Maps a SocialPlatform enum value (e.g. "YOUTUBE") to its display metadata (e.g. key "YouTube"). */
export function platformMetaForEnum(platform: string): PlatformMeta | undefined {
  return PLATFORMS.find((p) => p.key.toUpperCase() === platform.toUpperCase());
}
