import { Users } from "lucide-react";
import { platformMetaForEnum } from "@/lib/platforms";
import { formatCompact } from "@/lib/format";
import type { SocialAccount } from "@/generated/prisma/client";

type ConnectedAccount = Pick<SocialAccount, "id" | "platform" | "username" | "displayName" | "followerCount" | "lastSyncedAt">;

export function AudiencePanel({ socialAccounts }: { socialAccounts: ConnectedAccount[] }) {
  const totalReach = socialAccounts.reduce((sum, account) => sum + account.followerCount, 0);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink">Audience</h2>

      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <Users size={20} />
        </span>
        <div>
          <p className="text-lg font-semibold text-ink">{formatCompact(totalReach)}</p>
          <p className="text-xs text-muted">Total Reach (connected accounts)</p>
        </div>
      </div>

      {socialAccounts.length === 0 ? (
        <p className="text-xs text-muted">No connected accounts yet.</p>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted">Connected Accounts :</p>
          <div className="flex flex-wrap items-center gap-2">
            {socialAccounts.map((account) => {
              const meta = platformMetaForEnum(account.platform);
              return (
                <span key={account.id} className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8f9fb] px-3 py-2 text-xs font-medium text-ink">
                  {meta ? (
                    <span className={`flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${meta.color}`}>
                      {meta.short}
                    </span>
                  ) : null}
                  {account.displayName ?? meta?.key} · {formatCompact(account.followerCount)}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
