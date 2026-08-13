import { Topbar } from "@/components/dashboard/topbar";
import { InfluencerDirectory } from "@/components/influencers/influencer-directory";
import { getBrandCampaigns, getInfluencerDirectory } from "@/lib/data/brand";

export default async function BrandInfluencersPage() {
  const [influencers, campaigns] = await Promise.all([getInfluencerDirectory(), getBrandCampaigns()]);

  return (
    <div>
      <Topbar title="Influencers" description="Browse and invite influencers directly to your campaigns." />
      <div className="p-8">
        <InfluencerDirectory influencers={influencers} campaigns={campaigns} />
      </div>
    </div>
  );
}
