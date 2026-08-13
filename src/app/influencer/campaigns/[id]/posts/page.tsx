import { notFound } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { CampaignPostsList } from "@/components/influencer/campaign-posts-list";
import { getCampaignById } from "@/lib/data/campaigns";
import { getCampaignPostsForInfluencer, getInfluencerJoinedCampaigns } from "@/lib/data/influencer";

export default async function CampaignPostsPage({ params }: PageProps<"/influencer/campaigns/[id]/posts">) {
  const { id } = await params;

  const [campaign, posts, joined] = await Promise.all([
    getCampaignById(id),
    getCampaignPostsForInfluencer(id),
    getInfluencerJoinedCampaigns("demo-influencer-1"),
  ]);

  if (!campaign) notFound();

  const kpiProgress = joined.find((entry) => entry.campaign.id === id)?.kpiProgress ?? 0;

  return (
    <div>
      <Topbar
        title={campaign.title}
        description={`Key Performance Indicators (KPIs) ${kpiProgress}% · Posts are counted automatically from a synced social account when they include one of this campaign's hashtags`}
      />
      <div className="p-8">
        {campaign.hashtags?.length || campaign.postingSchedule?.length ? (
          <div className="mb-4 rounded-2xl border border-border-subtle bg-white p-5">
            {campaign.hashtags?.length ? (
              <>
                <h3 className="mb-1 text-sm font-semibold text-ink">Hashtags to include</h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  {campaign.hashtags.map((tag, i) => (
                    <span key={i} className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-brand-blue">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
            {campaign.postingSchedule?.length ? (
              <p className="text-xs text-muted">
                Eligible platforms for this campaign: {campaign.postingSchedule.map((item) => item.platform).join(", ")}
              </p>
            ) : null}
          </div>
        ) : null}
        <CampaignPostsList posts={posts} />
      </div>
    </div>
  );
}
