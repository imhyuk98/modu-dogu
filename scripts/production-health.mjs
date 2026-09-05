const baseUrl = process.env.PRODUCTION_BASE_URL ?? "https://modu-dogu.pages.dev";
const checks = [
  ["/", "무료 계산기·테스트·게임·온라인 도구 124개"],
  ["/calculation-policy", "계산 기준"],
  ["/calculators/salary", "연봉 실수령액 계산기"],
  ["/calculators/annual-leave", "연차 계산기"],
  ["/tools/telepathy-game", "텔레파시"],
  ["/en/calculators/loan", "Loan Payment Calculator"],
  ["/privacy", "쿼리 문자열과 해시는 분석 주소에서 제거"],
  ["/sitemap.xml", "<urlset"],
];

const requiredHeaders = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
};

const failures = [];
for (const [path, marker] of checks) {
  try {
    const response = await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(15_000), redirect: "follow" });
    const body = await response.text();
    if (!response.ok || !body.includes(marker)) failures.push({ path, status: response.status, missingMarker: marker });
    if (path === "/") {
      for (const [name, expected] of Object.entries(requiredHeaders)) {
        const actual = response.headers.get(name);
        if (actual !== expected) failures.push({ path, header: name, expected, actual });
      }
      const csp = response.headers.get("content-security-policy") ?? "";
      if (!csp.includes("script-src-attr 'none'")) {
        failures.push({ path, header: "content-security-policy", expected: "enforced CSP with script-src-attr 'none'", actual: csp || null });
      }
      const reportOnlyCsp = response.headers.get("content-security-policy-report-only");
      if (reportOnlyCsp) failures.push({ path, header: "content-security-policy-report-only", expected: null, actual: reportOnlyCsp });
    }
  } catch (error) {
    failures.push({ path, error: error instanceof Error ? error.message : String(error) });
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log(`Production health passed: ${checks.length} public routes.`);
