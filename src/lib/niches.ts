export const NICHES = [
  "Fashion",
  "Beauty",
  "Tech",
  "Food",
  "Fitness",
  "Travel",
  "Gaming",
  "Finance",
  "Lifestyle",
  "Education",
] as const;

export type Niche = (typeof NICHES)[number];

export function isNiche(value: string): value is Niche {
  return (NICHES as readonly string[]).includes(value);
}
