import Link from "next/link";
import { Button } from "@/components/ui/button";
import { daysUntil } from "@/lib/dates";
import type { MockCampaign } from "@/lib/mock-data";

const OBJECTIVE_CLASSES: Record<MockCampaign["objective"], string> = {
  AWARENESS: "text-violet-600",
  ENGAGEMENT: "text-brand-orange",
  PRODUCT: "text-brand-blue",
};

export function CampaignCard({ campaign }: { campaign: MockCampaign }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5">
      <div>
        <h3 className="text-sm font-semibold text-ink">{campaign.title}</h3>
        <p className={`text-[11px] font-semibold tracking-wide uppercase ${OBJECTIVE_CLASSES[campaign.objective]}`}>{campaign.objective}</p>
      </div>
      <p className="line-clamp-2 text-xs text-muted">{campaign.description}</p>
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted">
          {campaign.status === "COMPLETED" ? "Completed" : `${daysUntil(campaign.deadline)} Days`}
        </span>
        <Link href={`/brand/campaigns/${campaign.id}`}>
          <Button variant="secondary" fullWidth={false} className="px-5 py-2 text-xs">
            View Campaign
          </Button>
        </Link>
      </div>
    </div>
  );
}
