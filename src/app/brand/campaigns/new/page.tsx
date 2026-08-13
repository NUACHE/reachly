import { CampaignWizard } from "@/components/campaigns/campaign-wizard";
import { getInfluencerDirectory } from "@/lib/data/brand";

export default async function NewCampaignPage() {
  const influencers = await getInfluencerDirectory();
  return <CampaignWizard influencers={influencers} />;
}
