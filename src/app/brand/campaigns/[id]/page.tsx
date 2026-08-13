import { notFound } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { CampaignDetailTabs } from "@/components/campaigns/campaign-detail-tabs";
import {
  getApplicationsForCampaign,
  getCampaignActivity,
  getCampaignById,
  getCampaignInfluencerPerformance,
  getCampaignMetrics,
  getCampaignPlatformMetrics,
} from "@/lib/data/campaigns";

export default async function BrandCampaignDetailPage({ params }: PageProps<"/brand/campaigns/[id]">) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  const [applications, metrics, activity, influencerRows, platformMetrics] = await Promise.all([
    getApplicationsForCampaign(id),
    getCampaignMetrics(id),
    getCampaignActivity(id),
    getCampaignInfluencerPerformance(id),
    getCampaignPlatformMetrics(id),
  ]);

  return (
    <div>
      <Topbar title={campaign.title} description={campaign.description} action={<StatusBadge status={campaign.status} />} />
      <div className="p-8">
        <CampaignDetailTabs
          campaign={campaign}
          metrics={metrics}
          activity={activity}
          influencerRows={influencerRows}
          applications={applications}
          platformMetrics={platformMetrics}
        />
      </div>
    </div>
  );
}
