import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [headers, scientific, alcoholLogic, fuelMap, qualityWorkflow, fuelWorkflow, rateWorkflow] = await Promise.all([
  readFile("public/_headers", "utf8"),
  readFile("app/calculators/scientific/page.tsx", "utf8"),
  readFile("lib/calculations.ts", "utf8"),
  readFile("app/tools/fuel-map/page.tsx", "utf8"),
  readFile(".github/workflows/quality.yml", "utf8"),
  readFile(".github/workflows/update-fuel-prices.yml", "utf8"),
  readFile(".github/workflows/update-interest-rates.yml", "utf8"),
]);

assert.match(headers, /^\s*Content-Security-Policy:/m, "CSP must be enforced");
assert.match(headers, /script-src-attr 'none'/, "inline event handlers must be blocked");
assert.doesNotMatch(headers, /Content-Security-Policy-Report-Only:/, "report-only CSP does not block attacks");
assert.doesNotMatch(scientific, /new Function|\beval\s*\(/, "calculator must not require unsafe-eval");
assert.doesNotMatch(alcoholLogic, /canDrive|운전 가능\)/, "BAC calculation must not decide whether driving is safe");
assert.doesNotMatch(fuelMap, /\$\{station\.(?:name|addr)\}/, "external station text must not be interpolated into HTML");
assert.match(qualityWorkflow, /^\s+workflow_dispatch:/m, "data workflows need an explicit quality-check trigger");
for (const workflow of [fuelWorkflow, rateWorkflow]) {
  assert.match(workflow, /pull-requests: write/, "data updates must use pull requests");
  assert.doesNotMatch(workflow, /^\s+git push\s*$/m, "data updates must not push directly to the default branch");
  assert.match(workflow, /gh workflow run quality\.yml/, "data pull requests must dispatch the quality gate");
  assert.match(workflow, /gh pr merge .*--auto/, "verified data pull requests must retain automatic updates");
}

console.log("Security source regression checks passed.");
