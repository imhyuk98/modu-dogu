import assert from "node:assert/strict";

const {
  SALARY_CALCULATION_BASIS,
  calculateSalary,
  calculateUnemployment,
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

console.log("Calculation regression checks passed.");
