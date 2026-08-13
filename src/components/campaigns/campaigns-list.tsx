"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Megaphone } from "lucide-react";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Button } from "@/components/ui/button";
import type { CampaignStatus, MockCampaign } from "@/lib/mock-data";

const FILTERS: { label: string; statuses: CampaignStatus[] }[] = [
  { label: "All", statuses: ["OPEN", "ACTIVE", "CLOSED", "COMPLETED"] },
  { label: "Active", statuses: ["OPEN", "ACTIVE"] },
  { label: "Completed", statuses: ["COMPLETED"] },
  { label: "Closed", statuses: ["CLOSED"] },
];

export function CampaignsList({ campaigns }: { campaigns: MockCampaign[] }) {
  const [filterLabel, setFilterLabel] = useState(FILTERS[1].label);
  const activeStatuses = FILTERS.find((f) => f.label === filterLabel)?.statuses ?? [];
  const visible = campaigns.filter((campaign) => activeStatuses.includes(campaign.status));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base font-semibold text-ink">My Campaigns</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterLabel}
              onChange={(event) => setFilterLabel(event.target.value)}
              className="appearance-none rounded-lg border border-border-subtle bg-white py-2 pl-3 pr-8 text-xs font-medium text-ink outline-none"
            >
              {FILTERS.map((filter) => (
                <option key={filter.label} value={filter.label}>
                  {filter.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <Link href="/brand/campaigns/new">
            <Button fullWidth={false} className="px-6">
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-white px-6 py-20 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Megaphone size={28} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Start your first campaign</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
              Create a campaign and select influencers to help push your campaign and brand forward.
            </p>
          </div>
          <Link href="/brand/campaigns/new">
            <Button fullWidth={false} className="px-8">
              Create Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
