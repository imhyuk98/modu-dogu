export function daysSinceSeoulDate(dateKey: string): number {
  const timestamp = new Date(`${dateKey}T00:00:00+09:00`).getTime();
  return Number.isFinite(timestamp)
    ? Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000))
    : Number.POSITIVE_INFINITY;
}

export function isDataStale(dateKey: string, maxAgeDays: number): boolean {
  return daysSinceSeoulDate(dateKey) > maxAgeDays;
}

export function monthsSinceReferenceMonth(monthKey: string): number {
  if (!/^\d{6}$/.test(monthKey)) return Number.POSITIVE_INFINITY;
  const year = Number(monthKey.slice(0, 4));
  const month = Number(monthKey.slice(4, 6));
  if (month < 1 || month > 12) return Number.POSITIVE_INFINITY;

  const seoulParts = Object.fromEntries(
    new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(new Date()).map(({ type, value }) => [type, value])
  );
  const difference =
    (Number(seoulParts.year) - year) * 12 + Number(seoulParts.month) - month;
  return difference < 0 ? Number.POSITIVE_INFINITY : difference;
}

export function isReferenceDataStale(
  collectedDate: string,
  referenceMonth: string,
  maxCollectionAgeDays = 7,
  maxReferenceAgeMonths = 3
): boolean {
  return isDataStale(collectedDate, maxCollectionAgeDays) ||
    monthsSinceReferenceMonth(referenceMonth) > maxReferenceAgeMonths;
}
