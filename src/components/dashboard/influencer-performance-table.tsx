"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { initialsFor } from "@/lib/initials";

export interface InfluencerPerformanceRow {
  id: string;
  name: string;
  engagement: number;
  reach: number;
  impressions: number;
  totalSpent: number;
}

interface InfluencerPerformanceTableProps {
  rows: InfluencerPerformanceRow[];
  pageSize?: number;
}

export function InfluencerPerformanceTable({ rows, pageSize = 6 }: InfluencerPerformanceTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-medium text-muted">
            <tr className="border-b border-border-subtle">
              <th className="px-6 py-4">Influencer</th>
              <th className="px-6 py-4">Engagement</th>
              <th className="px-6 py-4">Reach</th>
              <th className="px-6 py-4">Impressions</th>
              <th className="px-6 py-4">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td className="flex items-center gap-3 px-6 py-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-[11px] font-semibold text-ink">
                    {initialsFor(row.name)}
                  </span>
                  <span className="text-xs font-medium text-ink">{row.name}</span>
                </td>
                <td className="px-6 py-4 text-xs text-ink tabular-nums">{row.engagement}</td>
                <td className="px-6 py-4 text-xs text-ink tabular-nums">{row.reach}</td>
                <td className="px-6 py-4 text-xs text-ink tabular-nums">{row.impressions}</td>
                <td className="px-6 py-4 text-xs text-ink tabular-nums">¢{row.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-1 border-t border-border-subtle px-6 py-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex size-7 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb] disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex size-7 items-center justify-center rounded-lg text-xs font-medium transition ${
                p === currentPage ? "bg-brand-blue text-white" : "text-ink hover:bg-[#f8f9fb]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex size-7 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb] disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
