import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardTrend {
  value: number;
  direction: "up" | "down";
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "blue" | "orange";
  trend?: StatCardTrend;
}

export function StatCard({ label, value, icon: Icon, accent = "blue", trend }: StatCardProps) {
  const accentClasses =
    accent === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-orange/10 text-brand-orange";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`flex size-11 items-center justify-center rounded-xl ${accentClasses}`}>
          <Icon size={20} />
        </span>
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              trend.direction === "up" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trend.direction === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value.toFixed(2)}%
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-lg font-semibold text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
