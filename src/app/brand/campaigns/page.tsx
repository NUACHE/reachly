import { Topbar } from "@/components/dashboard/topbar";
import { CampaignsList } from "@/components/campaigns/campaigns-list";
import { getBrandCampaigns } from "@/lib/data/brand";

export default async function BrandCampaignsPage() {
  const campaigns = await getBrandCampaigns();

  return (
    <div>
      <Topbar title="Campaigns" description="Manage your campaigns from creation to completion." />
      <div className="p-8">
        <CampaignsList campaigns={campaigns} />
      </div>
    </div>
  );
}
