"use client";

import { useMemo, useRef, useState } from "react";
import type { PlatformMetricPoint } from "@/lib/data/platform-metrics";

interface PlatformMetricsChartProps {
  points: PlatformMetricPoint[];
}

const SERIES_META = [
  { key: "reach" as const, label: "Reach", color: "#4b91d2" },
  { key: "engagement" as const, label: "Engagement", color: "#f8921b" },
];

const VIEW_W = 640;
const VIEW_H = 220;
const PAD_LEFT = 44;
const PAD_RIGHT = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 24;
const PLOT_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

function niceMax(value: number) {
  if (value <= 0) return 100;
  const step = value <= 100 ? 20 : value <= 500 ? 50 : value <= 5000 ? 500 : 5000;
  return Math.ceil(value / step) * step;
}

export function PlatformMetricsChart({ points }: PlatformMetricsChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const n = points.length;

  const max = useMemo(
    () => (n > 0 ? niceMax(Math.max(...points.flatMap((p) => [p.reach, p.engagement]))) : 100),
    [points, n]
  );

  const xAt = (i: number) => PAD_LEFT + (n > 1 ? (i / (n - 1)) * PLOT_W : PLOT_W / 2);
  const yAt = (value: number) => PAD_TOP + (1 - value / max) * PLOT_H;

  const linePath = (key: "reach" | "engagement") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p[key])}`).join(" ");

  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max];

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (n === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const fraction = (e.clientX - rect.left) / rect.width;
    const index = Math.round(fraction * (n - 1));
    setHoverIndex(Math.min(Math.max(index, 0), n - 1));
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const tooltipLeftPct = hoverIndex !== null ? (xAt(hoverIndex) / VIEW_W) * 100 : 0;
  const tooltipAlignRight = tooltipLeftPct > 65;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Platform Metrics</h2>
        <div className="flex items-center gap-4">
          {SERIES_META.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {n === 0 ? (
        <p className="py-16 text-center text-xs text-muted">
          No synced post data yet. Connect a social account and sync it to see real reach and engagement here.
        </p>
      ) : (
        <div ref={containerRef} className="relative" onMouseMove={handleMove} onMouseLeave={() => setHoverIndex(null)}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="h-56 w-full">
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={PAD_LEFT} x2={VIEW_W - PAD_RIGHT} y1={yAt(tick)} y2={yAt(tick)} stroke="#eceef2" strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={yAt(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted text-[9px]">
                  {Math.round(tick).toLocaleString()}
                </text>
              </g>
            ))}

            {points.map((p, i) => (
              <text key={`${p.label}-${i}`} x={xAt(i)} y={VIEW_H - 6} textAnchor="middle" className="fill-muted text-[9px]">
                {p.label}
              </text>
            ))}

            {SERIES_META.map((s) => (
              <path key={s.key} d={linePath(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {hoverIndex !== null ? (
              <line x1={xAt(hoverIndex)} x2={xAt(hoverIndex)} y1={PAD_TOP} y2={VIEW_H - PAD_BOTTOM} stroke="#c9cdd6" strokeWidth={1} />
            ) : null}

            {hoverIndex !== null
              ? SERIES_META.map((s) => (
                  <circle
                    key={s.key}
                    cx={xAt(hoverIndex)}
                    cy={yAt(points[hoverIndex][s.key])}
                    r={5}
                    fill={s.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))
              : null}
          </svg>

          {hovered ? (
            <div
              className="pointer-events-none absolute top-0 z-10 min-w-35 -translate-y-1 rounded-xl border border-border-subtle bg-white p-3 shadow-md"
              style={
                tooltipAlignRight
                  ? { right: `${100 - tooltipLeftPct}%`, transform: "translate(8px, -8px)" }
                  : { left: `${tooltipLeftPct}%`, transform: "translate(8px, -8px)" }
              }
            >
              <p className="mb-1.5 text-[10px] font-medium text-muted">{hovered.label}</p>
              <div className="flex flex-col gap-1">
                {SERIES_META.map((s) => (
                  <div key={s.key} className="flex items-center gap-1.5 text-xs">
                    <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-semibold text-ink">{hovered[s.key].toLocaleString()}</span>
                    <span className="text-muted">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
