import Link from "next/link";
import { indexableCalculatorResults } from "@/lib/calculator-result-indexing";

function exampleLabel(base: string, slug: string) {
  const [a, b, c] = slug.split("-");
  const amount = (value: string) => `${Number(value).toLocaleString("ko-KR")}만원`;
  switch (base) {
    case "/calculators/bmi": return `키 ${a}cm · 체중 ${b}kg`;
    case "/calculators/loan": return `대출 ${amount(a)} · 연 ${b}% · ${c}년`;
    case "/calculators/rent-conversion": return `전세 ${amount(a)} · 보증금 ${amount(b)} · 전환율 ${c}%`;
    case "/calculators/retirement": return `${a}년 근무 · 월급 ${amount(b)}`;
    case "/calculators/unemployment": return `${a}세 · ${b}년 근무 · 월급 ${amount(c)}`;
    default: return slug;
  }
}

export default function CalculatorResultExamples({ base }: { base: string }) {
  const paths = indexableCalculatorResults.filter((path) => path.startsWith(`${base}/`));
  if (!paths.length) return null;
  return (
    <section className="my-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <h2 className="mb-2 text-lg font-semibold">조건별 계산 예시</h2>
      <p className="mb-4 text-sm text-[var(--muted)]">정해진 조건의 계산 결과와 산출 과정을 확인하세요. 실제 조건이 다르면 계산기에 직접 입력해 주세요.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {paths.map((path) => (
          <li key={path}>
            <Link href={path} className="block rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm hover:underline">
              {exampleLabel(base, path.slice(base.length + 1))}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
