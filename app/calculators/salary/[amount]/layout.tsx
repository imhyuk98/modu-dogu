import { Metadata } from "next";
import { calculateSalary } from "@/lib/calculations";

const AMOUNTS = Array.from({ length: 81 }, (_, i) => 2000 + i * 100); // 2000~10000

export function generateStaticParams() {
  return AMOUNTS.map((a) => ({ amount: a.toString() }));
}

function formatMan(v: number) {
  if (v >= 10000) return `${v / 10000}억`;
  return `${v.toLocaleString()}만`;
}

function formatWon(v: number) {
  return Math.round(v).toLocaleString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const amountNum = parseInt(amount);
  const result = calculateSalary(amountNum * 10000);
  const monthlyNet = formatWon(result.monthlyNet);
  const amountLabel = formatMan(amountNum);

  const title = `연봉 ${amountLabel}원 실수령액 월 ${monthlyNet}원 (2026) | 모두의도구`;
  const description = `2026년 기준 연봉 ${amountLabel}원의 월 실수령액은 약 ${monthlyNet}원입니다. 4대보험 ${formatWon(result.nationalPension + result.healthInsurance + result.longTermCare + result.employmentInsurance)}원, 소득세 ${formatWon(result.incomeTax)}원 공제 후 계산 결과입니다.`;

  return {
    alternates: { canonical: "/calculators/salary" },
    robots: { index: false, follow: true },
    title,
    description,
    keywords: [
      `연봉 ${amountLabel}원 실수령액`,
      `${amountLabel} 연봉 월급`,
      `연봉 ${amountLabel} 세후`,
      `${amountLabel} 실수령`,
      "2026 연봉 실수령액",
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/salary/${amount}`,
    },
  };
}

export default function SalaryAmountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
