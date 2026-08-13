import Link from "next/link";
import { initialsFor } from "@/lib/initials";
import type { MockCampaign } from "@/lib/mock-data";

interface JoinedCampaignCardProps {
  campaign: MockCampaign;
  kpiProgress: number;
}

export function JoinedCampaignCard({ campaign, kpiProgress }: JoinedCampaignCardProps) {
  return (
    <Link
      href={`/influencer/campaigns/${campaign.id}/posts`}
      className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-5 transition hover:border-brand-blue"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f1f5] text-xs font-semibold text-ink">
          {initialsFor(campaign.title)}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{campaign.title}</p>
          <p className="text-xs text-muted">Deadline {campaign.deadline}</p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted">KPIs Completed</span>
          <span className="font-semibold text-brand-orange">{kpiProgress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#eceef2]">
          <div className="h-1.5 rounded-full bg-brand-orange" style={{ width: `${kpiProgress}%` }} />
        </div>
      </div>
    </Link>
  );
}
