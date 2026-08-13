import Link from "next/link";
import { initialsFor } from "@/lib/initials";
import { daysUntil } from "@/lib/dates";

const OBJECTIVE_BADGE: Record<string, string> = {
  AWARENESS: "bg-brand-orange/10 text-brand-orange",
  ENGAGEMENT: "bg-emerald-100 text-emerald-700",
  PRODUCT: "bg-brand-blue/10 text-brand-blue",
};

interface DiscoverCampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    deliverables: string;
    budget: number;
    deadline: string;
    objective: "AWARENESS" | "ENGAGEMENT" | "PRODUCT";
  };
}

export function DiscoverCampaignCard({ campaign }: DiscoverCampaignCardProps) {
  return (
    <Link
      href={`/influencer/campaigns/${campaign.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5 transition hover:border-brand-blue"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f1f5] text-xs font-semibold text-ink">
            {initialsFor(campaign.title)}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{campaign.title}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${OBJECTIVE_BADGE[campaign.objective]}`}>{campaign.objective}</span>
          <span className="text-[11px] text-muted">{daysUntil(campaign.deadline)} Days</span>
        </div>
      </div>

      <p className="text-xs font-semibold text-ink">{campaign.deliverables}</p>
      <p className="line-clamp-2 text-xs text-muted">{campaign.description}</p>
      <p className="text-xs font-semibold text-brand-blue">Earn up to ¢{campaign.budget}</p>
    </Link>
  );
}
