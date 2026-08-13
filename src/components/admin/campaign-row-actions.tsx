"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCampaignAction } from "@/lib/actions/admin";

export function CampaignRowActions({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    if (!confirm("Remove this campaign? This cannot be undone.")) return;
    startTransition(async () => {
      await removeCampaignAction(campaignId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={isPending}
      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      Remove
    </button>
  );
}
