import { Topbar } from "@/components/dashboard/topbar";
import { DiscoverCampaigns } from "@/components/influencer/discover-campaigns";
import { getOpenCampaignsForInfluencer } from "@/lib/data/influencer";

export default async function DiscoverCampaignsPage() {
  const campaigns = await getOpenCampaignsForInfluencer("demo-influencer-1");

  return (
    <div>
      <Topbar title="Campaigns" description="Open campaigns, ranked by how well they fit your niche and audience." />
      <div className="p-8">
        <DiscoverCampaigns campaigns={campaigns} />
      </div>
    </div>
  );
}
