/**
 * Shared view-model types for Prisma-row-to-UI mapping (see src/lib/data/*.ts).
 * Despite the name, these are just shapes now — the mock data constants that used to
 * live here (MOCK_CAMPAIGNS, MOCK_INFLUENCERS, etc.) were dead code with zero real
 * consumers and were removed 2026-08-13 (Technical_Debt_Plan DEBT-01c).
 */

export type CampaignStatus = "OPEN" | "ACTIVE" | "CLOSED" | "COMPLETED";
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export type CampaignObjective = "AWARENESS" | "ENGAGEMENT" | "PRODUCT";

export interface CampaignPostingScheduleItem {
  platform: string;
  count: number;
  frequency: string;
}

export interface MockCampaign {
  id: string;
  title: string;
  description: string;
  niches: string[];
  minFollowers: number;
  maxFollowers: number;
  budget: number;
  deliverables: string;
  status: CampaignStatus;
  deadline: string;
  objective: CampaignObjective;
  targetViews: number;
  targetLikes: number;
  dos?: string[];
  donts?: string[];
  hashtags?: string[];
  postingSchedule?: CampaignPostingScheduleItem[];
}

export interface MockCampaignMetrics {
  engagements: number;
  reach: number;
  impressions: number;
  totalInfluencers: number;
  totalPublishedPosts: number;
  totalSpend: number;
}

export interface MockActivityItem {
  id: string;
  influencerName: string;
  action: string;
  timeAgo: string;
}

export interface MockAlert {
  id: string;
  icon: "bell" | "mail";
  title: string;
  description: string;
  badge?: string;
}

export interface MockInfluencer {
  id: string;
  displayName: string;
  niches: string[];
  followerCount: number;
  engagementRate: number;
  bio: string;
  /** Real connected-platform accounts, e.g. from a synced YouTube channel — absent (not zero) when not fetched by the caller. */
  socialAccounts?: { id: string; platform: string; followerCount: number }[];
}

export interface MockApplication {
  id: string;
  campaignId: string;
  influencer: MockInfluencer;
  note: string;
  matchScore: number;
  status: ApplicationStatus;
  appliedAt: string;
}
