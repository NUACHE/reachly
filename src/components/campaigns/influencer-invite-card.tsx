import { Star } from "lucide-react";
import { initialsFor } from "@/lib/initials";
import { platformMetaForEnum } from "@/lib/platforms";
import { ratingFor } from "@/lib/influencer-stats";
import type { SocialAccount } from "@/generated/prisma/client";
import type { MockInfluencer } from "@/lib/mock-data";

type ConnectedAccount = Pick<SocialAccount, "id" | "platform" | "followerCount">;

interface InfluencerInviteCardProps {
  influencer: MockInfluencer & { socialAccounts: ConnectedAccount[] };
  invited: boolean;
  onToggle: () => void;
}

export function InfluencerInviteCard({ influencer, invited, onToggle }: InfluencerInviteCardProps) {
  const rating = ratingFor(influencer.engagementRate);
  const connectedReach = influencer.socialAccounts.reduce((sum, account) => sum + account.followerCount, 0);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-xs font-semibold text-ink">
          {initialsFor(influencer.displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-ink">{influencer.displayName}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11} className={i < rating ? "fill-brand-orange text-brand-orange" : "text-border-subtle"} />
            ))}
          </div>
        </div>
      </div>

      {influencer.socialAccounts.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          {influencer.socialAccounts.map((account) => {
            const meta = platformMetaForEnum(account.platform);
            return (
              <span key={account.id} className="inline-flex items-center gap-1">
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

      <div className="border-t border-border-subtle pt-3 text-[11px]">
        <p className="font-semibold text-ink">{connectedReach.toLocaleString()}</p>
        <p className="text-muted">Connected Reach</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`w-full rounded-lg py-2 text-xs font-semibold transition ${
          invited ? "bg-emerald-100 text-emerald-700" : "bg-brand-blue text-white hover:brightness-95"
        }`}
      >
        {invited ? "Invited" : "Invite to campaign"}
      </button>
    </div>
  );
}
