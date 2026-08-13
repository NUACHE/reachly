import { computeMatchScore } from "@/lib/matching";

/**
 * TEMPORARY demo data, used only while DEMO_MODE is on (see demo-accounts.ts
 * and Technical_Debt_Plan: DEBT-01). Replaced by real Prisma queries once the
 * database is connected — kept in one module so that swap touches one file
 * per data-access function, not every page.
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
  kpis?: string[];
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

export const MOCK_ALERTS: MockAlert[] = [
  { id: "alert-1", icon: "bell", title: "Campaign Invitation", description: "The campaign \"Campus Budgeting App Awareness\" has ended." },
  { id: "alert-2", icon: "bell", title: "Campaign Invitation", description: "The \"Home Workout Gear Review\" campaign has started." },
  {
    id: "alert-3",
    icon: "mail",
    title: "Campaign Invitation",
    description: "Your application to Summer Cold Brew Launch was accepted.",
    badge: "Accepted",
  },
  { id: "alert-4", icon: "bell", title: "Campaign Invitation", description: "Your campaign has been approved. You can publish it now." },
  { id: "alert-5", icon: "bell", title: "Campaign Post Review Response", description: "Your post on Home Workout Gear Review was approved." },
];

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

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  {
    id: "camp-1",
    title: "Summer Cold Brew Launch",
    description: "Promote our new cold brew line to a young, urban audience ahead of summer.",
    niches: ["Food", "Lifestyle"],
    minFollowers: 5000,
    maxFollowers: 50000,
    budget: 1200,
    deliverables: "2 Instagram Reels + 1 TikTok video",
    status: "OPEN",
    deadline: "2026-09-15",
    objective: "ENGAGEMENT",
    kpis: [
      "Engage 20 people in your audience group to respond by liking or favouriting your post",
      "Engage 10 people in your audience group to respond by sharing or reposting your post",
      "Engage a minimum of 5 people to directly refer to the brand or topic within 1 hour(s)",
    ],
    dos: ["All posts must go with all the 4 hashtags", "Each post should have minimum of 2 and maximum of 4 pics in post"],
    donts: ["No offensive captions", "All posts must go with no hashtags"],
    postingSchedule: [
      { platform: "Facebook", count: 1, frequency: "Per Day" },
      { platform: "Instagram", count: 1, frequency: "Per Day" },
    ],
  },
  {
    id: "camp-2",
    title: "Home Workout Gear Review",
    description: "Authentic reviews of our resistance-band starter kit from fitness creators.",
    niches: ["Fitness"],
    minFollowers: 2000,
    maxFollowers: 20000,
    budget: 600,
    deliverables: "1 unboxing video + 3 Story posts",
    status: "ACTIVE",
    deadline: "2026-08-30",
    objective: "PRODUCT",
    kpis: [
      "Engage 10 people in your audience group to respond by replying or commenting on your post",
      "Get a minimum of 100 people to see your post on this campaign",
    ],
    dos: ["Show the product unboxed in at least one photo"],
    donts: ["No competitor products visible in frame"],
    postingSchedule: [{ platform: "Instagram", count: 3, frequency: "Per Week" }],
  },
  {
    id: "camp-3",
    title: "Campus Budgeting App Awareness",
    description: "Introduce our student budgeting app to a Gen Z audience.",
    niches: ["Finance", "Education"],
    minFollowers: 1000,
    maxFollowers: 15000,
    budget: 400,
    deliverables: "1 TikTok explainer",
    status: "COMPLETED",
    deadline: "2026-06-01",
    objective: "AWARENESS",
    kpis: ["Get a minimum of 100 people to see your post on this campaign"],
    dos: ["Mention the app's student discount"],
    donts: ["No offensive captions"],
    postingSchedule: [{ platform: "TikTok", count: 1, frequency: "Per Week" }],
  },
  {
    id: "camp-4",
    title: "La Piazza Restaurant",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
    niches: ["Food"],
    minFollowers: 1000,
    maxFollowers: 20000,
    budget: 0,
    deliverables: "Website Design Promo",
    status: "OPEN",
    deadline: "2026-08-15",
    objective: "AWARENESS",
  },
  {
    id: "camp-5",
    title: "Green Ghana",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
    niches: ["Travel"],
    minFollowers: 1000,
    maxFollowers: 20000,
    budget: 0,
    deliverables: "Website Design Promo",
    status: "OPEN",
    deadline: "2026-08-15",
    objective: "AWARENESS",
  },
  {
    id: "camp-6",
    title: "Magnusens Interior Design",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
    niches: ["Lifestyle"],
    minFollowers: 1000,
    maxFollowers: 20000,
    budget: 0,
    deliverables: "Website Design Promo",
    status: "OPEN",
    deadline: "2026-08-15",
    objective: "AWARENESS",
  },
];

/** Aggregate performance per campaign, shown on the campaign detail page's Overview tab. */
export const MOCK_CAMPAIGN_METRICS: Record<string, MockCampaignMetrics> = {
  "camp-1": { engagements: 365, reach: 167, impressions: 4400, totalInfluencers: 5, totalPublishedPosts: 14, totalSpend: 304.53 },
  "camp-2": { engagements: 128, reach: 74, impressions: 1800, totalInfluencers: 2, totalPublishedPosts: 6, totalSpend: 120.4 },
  "camp-3": { engagements: 402, reach: 210, impressions: 5100, totalInfluencers: 3, totalPublishedPosts: 9, totalSpend: 480 },
};

export const MOCK_CAMPAIGN_ACTIVITY: Record<string, MockActivityItem[]> = {
  "camp-1": [
    { id: "act-1", influencerName: "Ama Boateng", action: "created a post", timeAgo: "4 hours ago" },
    { id: "act-2", influencerName: "Efua Mensah", action: "created a post", timeAgo: "2 days ago" },
    { id: "act-3", influencerName: "Kojo Antwi Jr.", action: "joined the campaign", timeAgo: "5 days ago" },
    { id: "act-4", influencerName: "Ama Boateng", action: "created a post", timeAgo: "1 week ago" },
  ],
  "camp-2": [
    { id: "act-5", influencerName: "Kwame Owusu", action: "created a post", timeAgo: "1 day ago" },
    { id: "act-6", influencerName: "Kwabena Sarpong", action: "joined the campaign", timeAgo: "3 days ago" },
  ],
  "camp-3": [
    { id: "act-7", influencerName: "Kojo Antwi Jr.", action: "created a post", timeAgo: "3 weeks ago" },
    { id: "act-8", influencerName: "Nana Yaw Asante", action: "created a post", timeAgo: "1 month ago" },
    { id: "act-9", influencerName: "Kojo Antwi Jr.", action: "joined the campaign", timeAgo: "1 month ago" },
  ],
};

export const MOCK_INFLUENCERS: MockInfluencer[] = [
  {
    id: "inf-1",
    displayName: "Ama Boateng",
    niches: ["Food", "Lifestyle"],
    followerCount: 22000,
    engagementRate: 5.2,
    bio: "Accra-based food & lifestyle creator, weekly recipe reels.",
  },
  {
    id: "inf-2",
    displayName: "Kwame Owusu",
    niches: ["Fitness"],
    followerCount: 8000,
    engagementRate: 3.1,
    bio: "Home workout routines and gear reviews.",
  },
  {
    id: "inf-3",
    displayName: "Efua Mensah",
    niches: ["Fashion", "Beauty"],
    followerCount: 45000,
    engagementRate: 6.8,
    bio: "Fashion editorial and beauty tutorials.",
  },
  {
    id: "inf-4",
    displayName: "Kojo Antwi Jr.",
    niches: ["Finance", "Education"],
    followerCount: 6500,
    engagementRate: 4.4,
    bio: "Personal finance tips for students.",
  },
  {
    id: "inf-5",
    displayName: "Nana Yaw Asante",
    niches: ["Tech"],
    followerCount: 15000,
    engagementRate: 4.9,
    bio: "Gadget reviews and campus tech tips.",
  },
  {
    id: "inf-6",
    displayName: "Adjoa Frimpong",
    niches: ["Beauty"],
    followerCount: 31000,
    engagementRate: 5.9,
    bio: "Skincare routines and product breakdowns.",
  },
  {
    id: "inf-7",
    displayName: "Kwabena Sarpong",
    niches: ["Fitness"],
    followerCount: 4200,
    engagementRate: 2.6,
    bio: "Amateur football training and gear talk.",
  },
  {
    id: "inf-8",
    displayName: "Abena Nyarko",
    niches: ["Lifestyle"],
    followerCount: 9800,
    engagementRate: 3.8,
    bio: "Weekend travel diaries around Ghana.",
  },
  {
    id: "inf-9",
    displayName: "Yaw Boateng",
    niches: ["Lifestyle"],
    followerCount: 12500,
    engagementRate: 4.1,
    bio: "Afrobeats playlists and studio behind-the-scenes.",
  },
];

export interface MockInfluencerPerformance {
  influencerId: string;
  engagement: number;
  reach: number;
  impressions: number;
  totalSpent: number;
}

/** Per-influencer performance for the brand dashboard's influencer table. */
export const MOCK_INFLUENCER_PERFORMANCE: MockInfluencerPerformance[] = [
  { influencerId: "inf-1", engagement: 0, reach: 0, impressions: 0, totalSpent: 0 },
  { influencerId: "inf-2", engagement: 0, reach: 15, impressions: 15, totalSpent: 24.15 },
  { influencerId: "inf-3", engagement: 0, reach: 0, impressions: 0, totalSpent: 0 },
  { influencerId: "inf-4", engagement: 0, reach: 0, impressions: 0, totalSpent: 0 },
  { influencerId: "inf-5", engagement: 0, reach: 0, impressions: 0, totalSpent: 0 },
  { influencerId: "inf-6", engagement: 0, reach: 32, impressions: 39, totalSpent: 0.52 },
  { influencerId: "inf-7", engagement: 0, reach: 0, impressions: 0, totalSpent: 490 },
  { influencerId: "inf-8", engagement: 0, reach: 0, impressions: 0, totalSpent: 0.24 },
  { influencerId: "inf-9", engagement: 0, reach: 0, impressions: 0, totalSpent: 0 },
];

function buildApplication(
  campaign: MockCampaign,
  influencer: MockInfluencer,
  overrides: Partial<Pick<MockApplication, "status" | "note" | "appliedAt">> = {}
): MockApplication {
  return {
    id: `app-${campaign.id}-${influencer.id}`,
    campaignId: campaign.id,
    influencer,
    note: overrides.note ?? "Excited to collaborate on this one!",
    matchScore: computeMatchScore({
      campaignNiches: campaign.niches,
      influencerNiches: influencer.niches,
      minFollowers: campaign.minFollowers,
      maxFollowers: campaign.maxFollowers,
      followerCount: influencer.followerCount,
      engagementRate: influencer.engagementRate,
    }),
    status: overrides.status ?? "PENDING",
    appliedAt: overrides.appliedAt ?? "2026-08-01",
  };
}

export const MOCK_APPLICATIONS: MockApplication[] = [
  buildApplication(MOCK_CAMPAIGNS[0], MOCK_INFLUENCERS[0], { status: "ACCEPTED" }),
  buildApplication(MOCK_CAMPAIGNS[0], MOCK_INFLUENCERS[2]),
  buildApplication(MOCK_CAMPAIGNS[0], MOCK_INFLUENCERS[3]),
  buildApplication(MOCK_CAMPAIGNS[1], MOCK_INFLUENCERS[1], { status: "ACCEPTED" }),
  buildApplication(MOCK_CAMPAIGNS[2], MOCK_INFLUENCERS[3], { status: "COMPLETED" }),
].sort((a, b) => b.matchScore - a.matchScore);

export function getMockApplicationsForCampaign(campaignId: string): MockApplication[] {
  return MOCK_APPLICATIONS.filter((application) => application.campaignId === campaignId).sort(
    (a, b) => b.matchScore - a.matchScore
  );
}

export function getMockCampaign(campaignId: string): MockCampaign | undefined {
  return MOCK_CAMPAIGNS.find((campaign) => campaign.id === campaignId);
}

export interface MockInfluencerPerformanceRow {
  id: string;
  name: string;
  engagement: number;
  reach: number;
  impressions: number;
  totalSpent: number;
}

/** Joins performance rows to display names — shared by the brand dashboard and campaign detail tables. */
export function getMockInfluencerPerformanceRows(): MockInfluencerPerformanceRow[] {
  return MOCK_INFLUENCER_PERFORMANCE.map((row) => {
    const influencer = MOCK_INFLUENCERS.find((i) => i.id === row.influencerId);
    return {
      id: row.influencerId,
      name: influencer?.displayName ?? "Unknown",
      engagement: row.engagement,
      reach: row.reach,
      impressions: row.impressions,
      totalSpent: row.totalSpent,
    };
  });
}
