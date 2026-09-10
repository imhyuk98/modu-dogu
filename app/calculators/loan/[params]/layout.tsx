import { Metadata } from "next";
import { calculatorResultMetadata } from "@/lib/calculator-result-indexing";
import { calculateLoan } from "@/lib/calculations";

const AMOUNTS = [5000, 10000, 15000, 20000, 30000, 40000, 50000]; // 만원 단위
const RATES = [3, 3.5, 4, 4.5, 5, 5.5, 6];
const YEARS = [10, 20, 30];

export function generateStaticParams() {
  const params: { params: string }[] = [];
  for (const a of AMOUNTS) {
    for (const r of RATES) {
      for (const y of YEARS) {
        params.push({ params: `${a}-${r}-${y}` });
      }
    }
  }
  return params;
}

function formatAmountLabel(manWon: number) {
  if (manWon >= 10000) return `${manWon / 10000}억`;
  return `${(manWon / 1000).toFixed(manWon % 1000 === 0 ? 0 : 1)}천만`;
}

function formatWon(v: number) {
  return Math.round(v).toLocaleString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ params: string }>;
}): Promise<Metadata> {
  const { params: p } = await params;
  const [amountStr, rateStr, yearsStr] = p.split("-");
  const amount = parseInt(amountStr);
  const rate = parseFloat(rateStr);
  const years = parseInt(yearsStr);

  const result = calculateLoan(amount * 10000, rate, years, "equalPrincipalInterest");
  const monthlyPayment = result.monthlyPayments[0]?.payment ?? 0;
  const amountLabel = formatAmountLabel(amount);

  const title = `${amountLabel}원 대출 ${rate}% ${years}년 월 ${formatWon(monthlyPayment)}원 | 모두의도구`;
  const description = `${amountLabel}원을 연 ${rate}% 금리로 ${years}년 대출 시 월 상환액은 약 ${formatWon(monthlyPayment)}원(원리금균등)입니다. 총 이자 ${formatWon(result.totalInterest)}원, 총 상환액 ${formatWon(result.totalPayment)}원.`;

  return {
    ...calculatorResultMetadata("/calculators/loan", p),
    title,
    description,
    keywords: [
      `${amountLabel} 대출 ${rate}%`,
      `${amountLabel} 대출 이자`,
      `${amountLabel} ${years}년 대출`,
      `대출 월 상환액 계산`,
      "대출이자 계산기",
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/loan/${p}`,
    },
  };
}

export default function LoanParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
