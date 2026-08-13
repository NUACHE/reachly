"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { DiscoverCampaignCard } from "@/components/influencer/discover-campaign-card";
import type { CampaignObjective } from "@/lib/mock-data";

const CATEGORIES: { label: string; value: CampaignObjective | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Product", value: "PRODUCT" },
  { label: "Engagement", value: "ENGAGEMENT" },
  { label: "Awareness", value: "AWARENESS" },
];

interface DiscoverCampaignsProps {
  campaigns: {
    id: string;
    title: string;
    description: string;
    deliverables: string;
    budget: number;
    deadline: string;
    objective: CampaignObjective;
    matchScore: number;
    alreadyApplied: boolean;
  }[];
}

export function DiscoverCampaigns({ campaigns }: DiscoverCampaignsProps) {
  const [category, setCategory] = useState<CampaignObjective | "All">("All");
  const [search, setSearch] = useState("");

  const visible = campaigns
    .filter((c) => !c.alreadyApplied)
    .filter((c) => category === "All" || c.objective === category)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-ink">Discover</h1>
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                category === cat.value ? "bg-brand-orange text-white" : "bg-white text-ink hover:bg-[#f8f9fb]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="rounded-lg border border-border-subtle bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder:text-muted/70 focus:border-brand-blue focus:outline-none"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">
          No open campaigns match right now — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((campaign) => (
            <DiscoverCampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
