"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { JoinedCampaignCard } from "@/components/influencer/joined-campaign-card";
import type { MockCampaign } from "@/lib/mock-data";

interface HomeCampaignsProps {
  entries: { application: { id: string }; campaign: MockCampaign; kpiProgress: number }[];
}

export function HomeCampaigns({ entries }: HomeCampaignsProps) {
  const [filter, setFilter] = useState<"Active" | "Completed">("Active");

  const visible = entries.filter((entry) =>
    filter === "Active" ? entry.campaign.status !== "COMPLETED" : entry.campaign.status === "COMPLETED"
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">My Campaigns</h2>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "Active" | "Completed")}
            className="appearance-none rounded-lg border border-border-subtle bg-white py-2 pl-3 pr-8 text-xs font-medium text-ink outline-none"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">
          No {filter.toLowerCase()} campaigns yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry) => (
            <JoinedCampaignCard key={entry.application.id} campaign={entry.campaign} kpiProgress={entry.kpiProgress} />
          ))}
        </div>
      )}
    </div>
  );
}
