"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { decideApplicationAction } from "@/lib/actions/campaigns";
import { initialsFor } from "@/lib/initials";
import type { MockApplication } from "@/lib/mock-data";

export function ApplicationRow({ application }: { application: MockApplication }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const socialAccounts = application.influencer.socialAccounts ?? [];
  const connectedReach = socialAccounts.reduce((sum, account) => sum + account.followerCount, 0);

  function decide(decision: "ACCEPTED" | "REJECTED") {
    setError(null);
    startTransition(async () => {
      const result = await decideApplicationAction({ applicationId: application.id, decision });
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-xs font-semibold text-ink">
          {initialsFor(application.influencer.displayName)}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-ink">{application.influencer.displayName}</p>
            <span
              title="How well this influencer matches the campaign's niches, follower range, and engagement — not an acceptance likelihood"
              className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold text-brand-blue"
            >
              {application.matchScore}% match
            </span>
          </div>
          <p className="text-sm text-muted">
            {application.influencer.niches.join(", ")} ·{" "}
            {socialAccounts.length > 0 ? `${connectedReach.toLocaleString()} connected reach` : "No connected accounts yet"}
          </p>
          {application.note ? (
            <p className="mt-1 text-sm text-ink">&ldquo;{application.note}&rdquo;</p>
          ) : null}
          {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {application.status === "PENDING" ? (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={() => decide("REJECTED")}
              className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[#f8f8f8] disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => decide("ACCEPTED")}
              className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              Accept
            </button>
          </>
        ) : (
          <StatusBadge status={application.status} />
        )}
      </div>
    </li>
  );
}
