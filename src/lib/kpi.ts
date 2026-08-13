/**
 * Real KPI progress for a campaign application: actual synced views/likes against the
 * Brand-defined targetViews/targetLikes, not the old binary "0% until COMPLETED, then 100%".
 * A metric with no target set (0) is excluded from the average rather than counted as met.
 */
export function kpiProgressPercent(
  actual: { views: number; likes: number },
  target: { targetViews: number; targetLikes: number },
): number {
  const ratios: number[] = [];
  if (target.targetViews > 0) ratios.push(Math.min(1, actual.views / target.targetViews));
  if (target.targetLikes > 0) ratios.push(Math.min(1, actual.likes / target.targetLikes));

  if (ratios.length === 0) return 0;
  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  return Math.round(average * 100);
}
