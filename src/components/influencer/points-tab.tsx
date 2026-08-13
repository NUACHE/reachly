import { Award, CheckCircle2 } from "lucide-react";
import { relativeTimeFrom } from "@/lib/dates";

interface PointsEntry {
  id: string;
  title: string;
  earnedAt: string;
}

export function PointsTab({ points, entries }: { points: number; entries: PointsEntry[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl bg-[#1e2a4a] px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white">
            <Award size={16} />
            {points.toLocaleString()} Points
          </span>
          <button
            type="button"
            disabled
            title="Redeeming points isn't available yet"
            className="flex flex-col items-center gap-1 rounded-xl border border-white/30 px-4 py-2 text-white/50"
          >
            <Award size={18} />
            <span className="text-xs font-medium">Redeem</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-white/60">
          Points are earned automatically from accepted campaigns. Redeeming points for cash
          is coming in a future update.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">
          No points earned yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-border-subtle bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Award size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">{entry.title}</p>
                  <p className="text-[11px] text-muted">{relativeTimeFrom(new Date(entry.earnedAt))}</p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
