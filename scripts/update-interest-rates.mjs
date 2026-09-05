import { writeFile } from "node:fs/promises";

const apiKey = process.env.BOK_API_KEY?.trim();
if (!apiKey) throw new Error("BOK_API_KEY is required; stale data was left unchanged.");

const months = Array.from({ length: 6 }, (_, offset) => {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - offset);
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
});

async function fetchSeries(statCode, itemCode) {
  for (const month of months) {
    const url = new URL(`https://ecos.bok.or.kr/api/StatisticSearch/${encodeURIComponent(apiKey)}/json/kr/1/5/${statCode}/M/${month}/${month}/${itemCode}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!response.ok) continue;
      const data = await response.json();
      const row = data?.StatisticSearch?.row?.find((candidate) => Number.isFinite(Number(candidate.DATA_VALUE)));
      if (row) return { value: Number(row.DATA_VALUE), period: row.TIME, name: row.ITEM_NAME1 };
    } catch {
      // Try an earlier published month without leaking the API-key URL.
    }
  }
  return null;
}

async function fetchGroup(entries, statCode) {
  const results = await Promise.all(entries.map(async ([key, itemCode, label]) => {
    const series = await fetchSeries(statCode, itemCode);
    return series ? [key, { rate: series.value, label, period: series.period }] : null;
  }));
  return Object.fromEntries(results.filter(Boolean));
}

const [baseRate, deposit, loan, savings] = await Promise.all([
  fetchSeries("722Y001", "0101000"),
  fetchGroup([
    ["6m_under", "BEABAA2111", "정기예금(6개월 미만)"],
    ["6m_1y", "BEABAA2112", "정기예금(6개월~1년 미만)"],
    ["1y_2y", "BEABAA2113", "정기예금(1~2년 미만)"],
    ["2y_3y", "BEABAA2114", "정기예금(2~3년 미만)"],
    ["avg", "BEABAA211", "정기예금"],
  ], "121Y002"),
  fetchGroup([
    ["avg", "BECBLA01", "대출평균"],
    ["household", "BECBLA03", "가계대출"],
    ["mortgage", "BECBLA0302", "주택담보대출"],
    ["mortgage_fixed", "BECBLA030201", "고정형 주택담보대출"],
    ["corporate", "BECBLA02", "기업대출"],
    ["small_loan", "BECBLA0301", "소액대출(500만원 이하)"],
  ], "121Y006"),
  fetchSeries("121Y002", "BEABAA1"),
]);

if (!baseRate || !savings || Object.keys(deposit).length !== 5 || Object.keys(loan).length !== 6) {
  throw new Error("Bank of Korea returned incomplete data; stale data was left unchanged.");
}

const dataMonth = [
  baseRate.period,
  savings.period,
  ...Object.values(deposit).map((entry) => entry.period),
  ...Object.values(loan).map((entry) => entry.period),
].sort()[0];

const dateParts = Object.fromEntries(new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
}).formatToParts(new Date()).map(({ type, value }) => [type, value]));
const updatedAt = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
const result = {
  updatedAt,
  dataMonth,
  baseRate: baseRate.value,
  deposit,
  loan,
  savings: savings.value,
};

await writeFile("public/interest-rates.json", `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(`Updated interest-rate references (${result.dataMonth}) on ${updatedAt}.`);
