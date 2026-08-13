"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Star } from "lucide-react";
import { initialsFor } from "@/lib/initials";
import { platformMetaForEnum } from "@/lib/platforms";
import { ratingFor } from "@/lib/influencer-stats";
import type { SocialAccount } from "@/generated/prisma/client";
import type { MockCampaign, MockInfluencer } from "@/lib/mock-data";

type ConnectedAccount = Pick<SocialAccount, "id" | "platform" | "username" | "displayName" | "followerCount" | "lastSyncedAt">;

interface InfluencerDirectoryCardProps {
  influencer: MockInfluencer & { socialAccounts: ConnectedAccount[] };
  campaigns: MockCampaign[];
}

export function InfluencerDirectoryCard({ influencer, campaigns }: InfluencerDirectoryCardProps) {
  const [invitedTo, setInvitedTo] = useState<string | null>(null);
  const rating = ratingFor(influencer.engagementRate);
  const connectedReach = influencer.socialAccounts.reduce((sum, account) => sum + account.followerCount, 0);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-sm font-semibold text-ink">
            {initialsFor(influencer.displayName)}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{influencer.displayName}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={12} className={i < rating ? "fill-brand-orange text-brand-orange" : "text-border-subtle"} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={invitedTo ?? ""}
            onChange={(e) => setInvitedTo(e.target.value || null)}
            className="rounded-lg border border-border-subtle bg-white px-2 py-1.5 text-[11px] font-medium text-ink outline-none"
          >
            <option value="">Invite to campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.title}
              </option>
            ))}
          </select>
          <Link
            href={`/brand/influencers/${influencer.id}`}
            aria-label={`View ${influencer.displayName}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb]"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {invitedTo ? <p className="text-[11px] text-emerald-600">Invited to {campaigns.find((c) => c.id === invitedTo)?.title}</p> : null}

      {influencer.socialAccounts.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {influencer.socialAccounts.map((account) => {
            const meta = platformMetaForEnum(account.platform);
            return (
              <span key={account.id} className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-medium text-ink">
                {meta ? (
                  <span className={`flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${meta.color}`}>
                    {meta.short}
                  </span>
                ) : null}
                {account.followerCount.toLocaleString()}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-muted">No connected accounts yet</p>
      )}

      <div className="border-t border-border-subtle pt-3 text-xs">
        <p className="font-semibold text-ink">{connectedReach.toLocaleString()}</p>
        <p className="text-muted">Connected Reach</p>
      </div>
    </div>
  );
}
