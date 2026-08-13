import { NICHES } from "@/lib/niches";

interface NicheSelectorProps {
  value: string[];
  onChange: (niches: string[]) => void;
  max?: number;
}

export function NicheSelector({ value, onChange, max = 3 }: NicheSelectorProps) {
  function toggle(niche: string) {
    if (value.includes(niche)) {
      onChange(value.filter((selected) => selected !== niche));
      return;
    }
    if (value.length >= max) return;
    onChange([...value, niche]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {NICHES.map((niche) => {
        const selected = value.includes(niche);
        return (
          <button
            key={niche}
            type="button"
            onClick={() => toggle(niche)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selected
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-border-subtle bg-white text-ink hover:border-brand-blue"
            }`}
          >
            {niche}
          </button>
        );
      })}
    </div>
  );
}
