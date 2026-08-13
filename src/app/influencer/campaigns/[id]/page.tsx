import { notFound } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { ApplyForm } from "@/components/campaigns/apply-form";
import { initialsFor } from "@/lib/initials";
import { daysUntil } from "@/lib/dates";
import { PLATFORMS } from "@/lib/platforms";
import { getCampaignById } from "@/lib/data/campaigns";
import { getOpenCampaignsForInfluencer } from "@/lib/data/influencer";

export default async function InfluencerCampaignDetailPage({
  params,
}: PageProps<"/influencer/campaigns/[id]">) {
  const { id } = await params;
  const influencerId = "demo-influencer-1";

  const [campaign, rankedCampaigns] = await Promise.all([
    getCampaignById(id),
    getOpenCampaignsForInfluencer(influencerId),
  ]);

  if (!campaign) notFound();

  const ranked = rankedCampaigns.find((c) => c.id === id);

  return (
    <div>
      <Topbar title={campaign.title} />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border-subtle bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f1f5] text-sm font-semibold text-ink">
                  {initialsFor(campaign.title)}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink">{campaign.title}</h2>
                  <p className="text-xs text-muted">{campaign.deadline}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-[10px] font-semibold text-brand-orange">{campaign.objective}</span>
                <span className="text-[11px] text-muted">{daysUntil(campaign.deadline)} day of campaign</span>
              </div>
            </div>

            {ranked ? (
              <p className="mt-3 text-xs text-muted">
                Your Match Score: <span className="font-semibold text-brand-blue">{ranked.matchScore}%</span>
              </p>
            ) : null}

            <p className="mt-4 text-xs font-semibold text-ink">{campaign.deliverables}</p>
            <p className="mt-1 text-xs text-muted">{campaign.description}</p>
            <p className="mt-3 text-xs font-semibold text-brand-blue">Earn up to ¢{campaign.budget}</p>
          </div>

          {campaign.targetViews > 0 || campaign.targetLikes > 0 ? (
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">Key Performance Indicators (KPIs)</h3>
              <ul className="flex flex-col gap-2.5">
                {campaign.targetViews > 0 ? (
                  <li className="text-xs text-muted">• {campaign.targetViews.toLocaleString()} views</li>
                ) : null}
                {campaign.targetLikes > 0 ? (
                  <li className="text-xs text-muted">• {campaign.targetLikes.toLocaleString()} likes</li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <ApplyForm campaignId={campaign.id} alreadyApplied={ranked?.alreadyApplied ?? false} />
        </div>

        <div className="flex flex-col gap-6">
          {campaign.postingSchedule?.length ? (
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">Posting Schedule</h3>
              <ul className="flex flex-col gap-3">
                {campaign.postingSchedule.map((item, i) => {
                  const platform = PLATFORMS.find((p) => p.key === item.platform);
                  return (
                    <li key={i} className="flex items-center gap-2 text-xs text-ink">
                      {platform ? (
                        <span className={`flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${platform.color}`}>
                          {platform.short}
                        </span>
                      ) : null}
                      {item.platform} · {item.count} Posts {item.frequency}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {campaign.hashtags?.length ? (
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="mb-1 text-sm font-semibold text-ink">Hashtags</h3>
              <p className="mb-3 text-xs text-muted">
                Include one of these in your post&apos;s title or description — that&apos;s how a synced post gets matched to this campaign.
              </p>
              <div className="flex flex-wrap gap-2">
                {campaign.hashtags.map((tag, i) => (
                  <span key={i} className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-brand-blue">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border-subtle bg-white p-6">
            {campaign.dos?.length ? (
              <>
                <h3 className="mb-3 text-sm font-semibold text-ink">Do&apos;s</h3>
                <ul className="mb-4 flex flex-col gap-2">
                  {campaign.dos.map((item, i) => (
                    <li key={i} className="text-xs text-muted">
                      • {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {campaign.donts?.length ? (
              <>
                <h3 className="mb-3 text-sm font-semibold text-ink">Don&apos;ts</h3>
                <ul className="flex flex-col gap-2">
                  {campaign.donts.map((item, i) => (
                    <li key={i} className="text-xs text-muted">
                      • {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
