"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyToCampaignAction } from "@/lib/actions/influencer";

interface ApplyFormProps {
  campaignId: string;
  alreadyApplied?: boolean;
}

export function ApplyForm({ campaignId, alreadyApplied = false }: ApplyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);

  async function handleJoin() {
    setError(null);
    setIsSubmitting(true);

    const result = await applyToCampaignAction({ campaignId, note: "" });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setApplied(true);
    router.refresh();
  }

  if (applied) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-white p-6 text-center">
        <p className="text-xs font-semibold text-ink">You&apos;ve applied to this campaign</p>
        <p className="mt-1 text-xs text-muted">The brand will review your application shortly.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <Button fullWidth={false} className="flex items-center gap-2 px-8" disabled={isSubmitting} onClick={handleJoin}>
        <Plus size={16} />
        {isSubmitting ? "Joining..." : "Join Campaign"}
      </Button>
    </div>
  );
}
