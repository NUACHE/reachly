/** Star rating (3-5), derived from engagement rate — no separate rating field exists in the data model. */
export function ratingFor(engagementRate: number) {
  return Math.min(5, Math.max(3, Math.round(engagementRate / 1.5)));
}
