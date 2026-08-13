"use client";

import { useState } from "react";
import { Filter as FilterIcon } from "lucide-react";
import { InfluencerDirectoryCard } from "@/components/influencers/influencer-directory-card";
import { DEFAULT_INFLUENCER_FILTERS, InfluencerFilterPanel, type InfluencerFilters } from "@/components/influencers/influencer-filter-panel";
import { Button } from "@/components/ui/button";
import { ratingFor } from "@/lib/influencer-stats";
import type { SocialAccount } from "@/generated/prisma/client";
import type { MockCampaign, MockInfluencer } from "@/lib/mock-data";

type DirectoryInfluencer = MockInfluencer & {
  socialAccounts: Pick<SocialAccount, "id" | "platform" | "username" | "displayName" | "followerCount" | "lastSyncedAt">[];
};

interface InfluencerDirectoryProps {
  influencers: DirectoryInfluencer[];
  campaigns: MockCampaign[];
}

export function InfluencerDirectory({ influencers, campaigns }: InfluencerDirectoryProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<InfluencerFilters>(DEFAULT_INFLUENCER_FILTERS);

  const visible = influencers.filter((influencer) => {
    const matchesNiche = filters.niches.length === 0 || influencer.niches.some((niche) => filters.niches.includes(niche));
    const matchesRating = ratingFor(influencer.engagementRate) >= filters.minRating;
    const matchesFollowers = influencer.followerCount >= filters.minFollowers;
    return matchesNiche && matchesRating && matchesFollowers;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base font-semibold text-ink">Influencers</h1>
        <Button fullWidth={false} className="flex items-center gap-2 px-6" onClick={() => setFilterOpen(true)}>
          <FilterIcon size={15} />
          Filter
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">
          No influencers match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((influencer) => (
            <InfluencerDirectoryCard key={influencer.id} influencer={influencer} campaigns={campaigns} />
          ))}
        </div>
      )}

      <InfluencerFilterPanel key={String(filterOpen)} open={filterOpen} initial={filters} onClose={() => setFilterOpen(false)} onApply={(next) => { setFilters(next); setFilterOpen(false); }} />
    </div>
  );
}
