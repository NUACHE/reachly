import { Topbar } from "@/components/dashboard/topbar";
import { InfluencerProfileSettings } from "@/components/influencer/influencer-profile-settings";
import {
  getInfluencerJoinedCampaigns,
  getInfluencerProfile,
  getSocialAccountsForInfluencer,
} from "@/lib/data/influencer";

interface InfluencerProfilePageProps {
  searchParams: Promise<{ tab?: string; social_error?: string }>;
}

export default async function InfluencerProfilePage({ searchParams }: InfluencerProfilePageProps) {
  const influencerId = "demo-influencer-1";
  const params = await searchParams;

  const [profile, joined, socialAccounts] = await Promise.all([
    getInfluencerProfile(influencerId),
    getInfluencerJoinedCampaigns(influencerId),
    getSocialAccountsForInfluencer(),
  ]);

  const youtubeAccount = socialAccounts.find((account) => account.platform === "YOUTUBE") ?? null;
  const points = joined.reduce((sum, entry) => sum + entry.points, 0);

  return (
    <div>
      <Topbar title="Profile" description="Manage your points, connected accounts, and settings." />
      <div className="p-8">
        <InfluencerProfileSettings
          profile={{ ...profile, bio: profile.bio ?? "" }}
          points={points}
          pointsEntries={joined.map((entry) => ({
            id: entry.application.id,
            title: entry.campaign.title,
            earnedAt: entry.application.decidedAt,
            points: entry.points,
            views: entry.pointsViews,
            engagement: entry.pointsEngagement,
          }))}
          youtubeAccount={youtubeAccount}
          initialTab={params.tab === "connected" ? "connected" : undefined}
          socialError={params.social_error ?? null}
        />
      </div>
    </div>
  );
}
