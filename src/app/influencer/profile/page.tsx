import { Topbar } from "@/components/dashboard/topbar";
import { InfluencerProfileSettings } from "@/components/influencer/influencer-profile-settings";
import {
  getInfluencerBalance,
  getInfluencerJoinedCampaigns,
  getInfluencerProfile,
  getSocialAccountsForInfluencer,
} from "@/lib/data/influencer";
import { requireUser } from "@/lib/rbac";

interface InfluencerProfilePageProps {
  searchParams: Promise<{ tab?: string; social_error?: string }>;
}

export default async function InfluencerProfilePage({ searchParams }: InfluencerProfilePageProps) {
  const influencerId = "demo-influencer-1";
  const params = await searchParams;

  const [profile, balance, joined, user, socialAccounts] = await Promise.all([
    getInfluencerProfile(influencerId),
    getInfluencerBalance(influencerId),
    getInfluencerJoinedCampaigns(influencerId),
    requireUser(),
    getSocialAccountsForInfluencer(),
  ]);

  const youtubeAccount = socialAccounts.find((account) => account.platform === "YOUTUBE") ?? null;

  return (
    <div>
      <Topbar title="Profile" description="Manage your wallet, connected accounts, and settings." />
      <div className="p-8">
        <InfluencerProfileSettings
          profile={{ ...profile, bio: profile.bio ?? "" }}
          balance={balance}
          earningEntries={joined.map((entry) => ({ id: entry.application.id, title: entry.campaign.title }))}
          email={user.email}
          youtubeAccount={youtubeAccount}
          initialTab={params.tab === "connected" ? "connected" : undefined}
          socialError={params.social_error ?? null}
        />
      </div>
    </div>
  );
}
