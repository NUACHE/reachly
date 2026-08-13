import type { LucideIcon } from "lucide-react";
import { LineChart, Users, Wallet } from "lucide-react";

interface OverviewPanelProps {
  reach: number;
  engagement: number;
  impressions: number;
}

interface OverviewRow {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
}

export function OverviewPanel({ reach, engagement, impressions }: OverviewPanelProps) {
  const rows: OverviewRow[] = [
    { label: "Reach", value: reach.toLocaleString(), icon: Users, accent: "bg-violet-100 text-violet-600" },
    { label: "Engagement", value: engagement.toLocaleString(), icon: Wallet, accent: "bg-brand-blue/10 text-brand-blue" },
    { label: "Impressions", value: `¢${impressions.toFixed(1)}`, icon: LineChart, accent: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">Overview</h2>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${row.accent}`}>
              <row.icon size={20} />
            </span>
            <div>
              <p className="text-lg font-semibold text-ink">{row.value}</p>
              <p className="text-xs text-muted">{row.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
