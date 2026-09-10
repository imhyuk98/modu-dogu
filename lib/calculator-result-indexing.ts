// Reviewed recovery cohort: 25 result URLs with observed landing sessions on
// 2026-08-11..2026-09-03, before the blanket noindex change (f591a2d).
// Keep this allowlist explicit: traffic is a recovery signal, not proof of quality
// or a reason to index every generated combination. See docs/seo-recovery-2026-09-10.md.
export const indexableCalculatorResults = [
  "/calculators/bmi/165-60",
  "/calculators/bmi/170-70",
  "/calculators/bmi/175-80",
  "/calculators/bmi/180-75",
  "/calculators/loan/10000-4-20",
  "/calculators/loan/10000-4-30",
  "/calculators/loan/10000-5-20",
  "/calculators/loan/20000-4-20",
  "/calculators/loan/20000-4-30",
  "/calculators/loan/30000-4-30",
  "/calculators/loan/30000-5-30",
  "/calculators/loan/50000-4-30",
  "/calculators/rent-conversion/10000-1000-5",
  "/calculators/rent-conversion/20000-3000-5",
  "/calculators/rent-conversion/30000-5000-5",
  "/calculators/rent-conversion/50000-5000-5",
  "/calculators/retirement/10-350",
  "/calculators/retirement/3-250",
  "/calculators/retirement/3-300",
  "/calculators/retirement/5-250",
  "/calculators/retirement/5-300",
  "/calculators/unemployment/30-1-250",
  "/calculators/unemployment/35-3-300",
  "/calculators/unemployment/40-5-350",
  "/calculators/unemployment/50-10-300"
] as const;

const indexablePaths = new Set<string>(indexableCalculatorResults);

export function calculatorResultMetadata(base: string, slug: string) {
  const path = `${base}/${slug}`;
  const index = indexablePaths.has(path);
  return {
    alternates: { canonical: index ? path : base },
    robots: { index, follow: true },
  };
}
