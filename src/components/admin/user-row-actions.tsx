"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleUserSuspensionAction } from "@/lib/actions/admin";

export function UserRowActions({ userId, suspended, isAdmin }: { userId: string; suspended: boolean; isAdmin: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (isAdmin) return <span className="text-muted">—</span>;

  function toggle() {
    startTransition(async () => {
      await toggleUserSuspensionAction(userId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
        suspended
          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          : "border-border-subtle text-ink hover:bg-[#f8f8f8]"
      }`}
    >
      {suspended ? "Reactivate" : "Suspend"}
    </button>
  );
}
