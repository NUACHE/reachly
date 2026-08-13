"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NICHES } from "@/lib/niches";

export interface InfluencerFilters {
  niches: string[];
  minRating: number;
  minFollowers: number;
}

export const DEFAULT_INFLUENCER_FILTERS: InfluencerFilters = { niches: [], minRating: 0, minFollowers: 0 };

interface InfluencerFilterPanelProps {
  open: boolean;
  initial: InfluencerFilters;
  onClose: () => void;
  onApply: (filters: InfluencerFilters) => void;
}

export function InfluencerFilterPanel({ open, initial, onClose, onApply }: InfluencerFilterPanelProps) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  if (!open) return null;

  function toggleNiche(niche: string) {
    setDraft((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche) ? prev.niches.filter((n) => n !== niche) : [...prev.niches, niche],
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between bg-brand-blue px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Filter</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-white/80 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Niches</h3>
            <div className="grid grid-cols-2 gap-y-2">
              {NICHES.map((niche) => (
                <label key={niche} className="flex items-center gap-2 text-xs text-ink">
                  <input
                    type="checkbox"
                    checked={draft.niches.includes(niche)}
                    onChange={() => toggleNiche(niche)}
                    className="size-4 rounded border-border-subtle text-brand-orange focus:ring-brand-orange"
                  />
                  {niche}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <h3 className="mb-3 text-sm font-semibold text-ink">Rating</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button key={value} type="button" onClick={() => setDraft((prev) => ({ ...prev, minRating: value }))}>
                      <Star size={22} className={value <= draft.minRating ? "fill-brand-orange text-brand-orange" : "text-border-subtle"} />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-muted">{draft.minRating > 0 ? `(${draft.minRating} Star)` : "(Any)"}</span>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <h3 className="mb-3 text-sm font-semibold text-ink">Minimum Followers</h3>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={draft.minFollowers}
              onChange={(e) => setDraft((prev) => ({ ...prev, minFollowers: Number(e.target.value) }))}
              className="w-full accent-brand-blue"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted">
              <span>0</span>
              <span>100,000+</span>
            </div>
            <p className="mt-2 text-xs text-ink">At least {draft.minFollowers.toLocaleString()} followers</p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border-subtle p-6">
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(DEFAULT_INFLUENCER_FILTERS);
              onApply(DEFAULT_INFLUENCER_FILTERS);
            }}
          >
            Reset
          </Button>
          <Button onClick={() => onApply(draft)}>Apply</Button>
        </div>
      </div>
    </div>
  );
}
