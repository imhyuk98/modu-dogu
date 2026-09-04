import assert from "node:assert/strict";

const {
  SALARY_CALCULATION_BASIS,
  calculateAnnualLeave,
  calculateRequiredGpa,
  calculateSalary,
  calculateUnemployment,
  calculateWeightedGpa,
  convertArea,
} = await import("../lib/calculations.ts");

assert.deepEqual(SALARY_CALCULATION_BASIS, {
  effectiveFrom: "2026-07-01",
  nationalPension: 0.0475,
  healthInsurance: 0.03595,
  longTermCare: 0.1314,
  employmentInsurance: 0.009,
  pensionUpperLimit: 6_590_000,
  pensionLowerLimit: 410_000,
});

const salary = calculateSalary(40_000_000);
assert.equal(salary.monthlyGross, 3_333_333);
assert.equal(salary.nationalPension, 158_333);
assert.equal(salary.healthInsurance, 119_833);
assert.equal(salary.longTermCare, 15_746);
assert.equal(salary.employmentInsurance, 30_000);
assert.equal(salary.monthlyNet, salary.monthlyGross - salary.totalDeductions);

const pensionFloor = calculateSalary(1_200_000);
assert.equal(pensionFloor.nationalPension, 19_475);
const pensionCeiling = calculateSalary(120_000_000);
assert.equal(pensionCeiling.nationalPension, 313_025);

const unemploymentFloor = calculateUnemployment(35, 3, 2_000_000);
assert.equal(unemploymentFloor.dailyAmount, 66_048);
assert.equal(unemploymentFloor.totalDays, 180);
assert.equal(
  unemploymentFloor.totalAmount,
  unemploymentFloor.dailyAmount * unemploymentFloor.totalDays,
);

const unemploymentCeiling = calculateUnemployment(35, 3, 10_000_000);
assert.equal(unemploymentCeiling.dailyAmount, 68_100);
assert.equal(unemploymentCeiling.monthlyAmount, 2_043_000);

const annualBase = {
  basis: "hire-date",
  mode: "employed",
  usedLeave: 0,
  attendanceAtLeast80: true,
};

const monthEndHire = calculateAnnualLeave({
  ...annualBase,
  startDate: "2026-01-31",
  referenceDate: "2026-02-28",
});
assert.equal(monthEndHire.currentAvailable, 1, "month-end hire accrues on the clamped monthly anniversary");

const underOneYear = calculateAnnualLeave({
  ...annualBase,
  startDate: "2025-01-01",
  referenceDate: "2025-12-31",
  mode: "separation",
});
assert.equal(underOneYear.currentAvailable, 11, "365-day separation must not create the 15-day grant");
assert.equal(underOneYear.historicalGenerated, 11);

const anniversary = calculateAnnualLeave({
  ...annualBase,
  startDate: "2025-01-01",
  referenceDate: "2026-01-01",
  mode: "separation",
});
assert.equal(anniversary.currentAvailable, 15, "employment on the first anniversary creates 15 days");
assert.equal(anniversary.historicalGenerated, 26);

const longService = calculateAnnualLeave({
  ...annualBase,
  startDate: "1996-01-01",
  referenceDate: "2026-01-01",
});
assert.equal(longService.currentGranted, 25, "annual grant is capped at 25 days");

const attendanceFallback = calculateAnnualLeave({
  ...annualBase,
  startDate: "2025-01-01",
  referenceDate: "2026-01-01",
  attendanceAtLeast80: false,
  perfectAttendanceMonths: 7,
});
assert.equal(attendanceFallback.currentGranted, 7, "sub-80% attendance uses perfect-attendance months");

for (const [unit, value] of [["pyeong", 34], ["sqm", 84], ["sqft", 900]]) {
  const converted = convertArea(value, unit);
  const roundTrip = convertArea(converted.sqm, "sqm");
  assert.ok(Math.abs(roundTrip[unit] - value) < 1e-9, `${unit} round trip`);
}
assert.ok(Math.abs(convertArea(84, "sqm").pyeong - 25.41) < 0.01, "84 square metres is about 25.41 pyeong");

const semesterGpa = calculateWeightedGpa([
  { credits: 3, points: 4.5 },
  { credits: 3, points: 3.5 },
  { credits: 2, points: 0, excluded: true },
]);
assert.equal(semesterGpa.credits, 6);
assert.equal(semesterGpa.gpa, 4);
assert.equal(calculateRequiredGpa(3.5, 60, 3.8, 30), 4.4);
assert.ok(calculateRequiredGpa(3, 120, 4, 10) > 4.5, "impossible GPA target is detectable");

console.log("Calculation regression checks passed.");
