"use client";

import { useState } from "react";
import { initialsFor } from "@/lib/initials";
import type { MockCampaign, MockInfluencer } from "@/lib/mock-data";

interface InfluencerProfileHeaderProps {
  influencer: MockInfluencer;
  campaigns: MockCampaign[];
}

export function InfluencerProfileHeader({ influencer, campaigns }: InfluencerProfileHeaderProps) {
  const [invitedTo, setInvitedTo] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-lg font-semibold text-ink">
            {initialsFor(influencer.displayName)}
          </span>
          <div>
            <h1 className="text-base font-semibold text-ink">{influencer.displayName}</h1>
            <p className="text-xs text-muted">{influencer.engagementRate}% self-reported engagement rate</p>
          </div>
        </div>

        <select
          value={invitedTo ?? ""}
          onChange={(e) => setInvitedTo(e.target.value || null)}
          className="rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white outline-none"
        >
          <option value="">Invite to Campaign</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.title}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">{influencer.bio}</p>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-ink">Tags</p>
        <div className="flex flex-wrap gap-2">
          {influencer.niches.map((niche) => (
            <span key={niche} className="rounded-full bg-brand-blue/5 px-3 py-1 text-xs font-medium text-brand-blue">
              {niche}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
