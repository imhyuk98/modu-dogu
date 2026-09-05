export function daysSinceSeoulDate(dateKey: string): number {
  const timestamp = new Date(`${dateKey}T00:00:00+09:00`).getTime();
  return Number.isFinite(timestamp)
    ? Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000))
    : Number.POSITIVE_INFINITY;
}

export function isDataStale(dateKey: string, maxAgeDays: number): boolean {
  return daysSinceSeoulDate(dateKey) > maxAgeDays;
}
