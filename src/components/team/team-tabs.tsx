"use client";

import { useState } from "react";
import { BrandProfileForm } from "@/components/team/brand-profile-form";
import { TeamMembersTable } from "@/components/team/team-members-table";
import type { TeamMember } from "@/generated/prisma/client";

const TABS = ["Brand Profile", "Members"] as const;

interface TeamTabsProps {
  brand: { companyName: string; website: string | null };
  members: TeamMember[];
}

export function TeamTabs({ brand, members }: TeamTabsProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Brand Profile");

  return (
    <div>
      <div className="mb-6 flex gap-6 border-b border-border-subtle">
        {TABS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={`-mb-px border-b-2 px-1 py-3 text-xs font-medium transition ${
              tab === option ? "border-brand-orange text-brand-orange" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {tab === "Brand Profile" ? (
        <BrandProfileForm companyName={brand.companyName} website={brand.website} />
      ) : (
        <TeamMembersTable initialMembers={members} />
      )}
    </div>
  );
}
