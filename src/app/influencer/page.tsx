import { Award } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { HomeCampaigns } from "@/components/influencer/home-campaigns";
import { getInfluencerJoinedCampaigns, getInfluencerProfile } from "@/lib/data/influencer";

export default async function InfluencerDashboardPage() {
  const influencerId = "demo-influencer-1";
  const [profile, joined] = await Promise.all([
    getInfluencerProfile(influencerId),
    getInfluencerJoinedCampaigns(influencerId),
  ]);
  const points = joined.reduce((sum, entry) => sum + entry.points, 0);
  const firstName = profile.displayName.split(" ")[0];

  return (
    <div>
      <Topbar title="Home" />

      <div className="flex flex-col gap-6 p-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#1e2a4a] px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Hi {firstName}!</h1>
              <p className="mt-1 text-sm text-white/70">Welcome to Reachly, we hope you are ready to begin influencing.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
              <Award size={18} />
              {points.toLocaleString()} Points
            </span>
          </div>
        </div>

        <HomeCampaigns entries={joined} />
      </div>
    </div>
  );
}
