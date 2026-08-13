"use client";

import { useState } from "react";
import { CheckCircle2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WithdrawFundsModal } from "@/components/influencer/withdraw-funds-modal";

interface EarningEntry {
  id: string;
  title: string;
  timeAgo: string;
}

const TIME_LABELS = ["2 weeks ago", "1 month ago", "2 years ago", "3 months ago"];

function timeAgoFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % TIME_LABELS.length;
  return TIME_LABELS[hash];
}

export function WalletTab({ balance, entries }: { balance: number; entries: { id: string; title: string }[] }) {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [subTab, setSubTab] = useState<"Earnings" | "Withdrawals">("Earnings");

  const earnings: EarningEntry[] = entries.map((entry) => ({ id: entry.id, title: entry.title, timeAgo: timeAgoFor(entry.id) }));

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl bg-[#1e2a4a] px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white">
            <Landmark size={16} />
            Your Balance : ¢{balance.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/30 px-4 py-2 text-white transition hover:bg-white/10"
          >
            <Landmark size={18} />
            <span className="text-xs font-medium">Withdraw</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["Earnings", "Withdrawals"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSubTab(option)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              subTab === option ? "bg-brand-orange text-white" : "bg-[#f8f9fb] text-muted"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {subTab === "Withdrawals" ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">No withdrawals yet.</p>
      ) : earnings.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">No earnings yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {earnings.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-border-subtle bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Landmark size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">{entry.title}</p>
                  <p className="text-[11px] text-muted">{entry.timeAgo}</p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          ))}
        </div>
      )}

      <WithdrawFundsModal open={withdrawOpen} balance={balance} onClose={() => setWithdrawOpen(false)} />
    </div>
  );
}
