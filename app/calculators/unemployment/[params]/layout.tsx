import { Metadata } from "next";
import { calculatorResultMetadata } from "@/lib/calculator-result-indexing";
import { calculateUnemployment } from "@/lib/calculations";

const AGES = [30, 35, 40, 45, 50, 55];
const WORKED_YEARS = [1, 2, 3, 5, 7, 10, 15];
const MONTHLY_PAYS = [200, 250, 300, 350, 400]; // 만원 단위

export function generateStaticParams() {
  const params: { params: string }[] = [];
  for (const age of AGES) {
    for (const years of WORKED_YEARS) {
      for (const pay of MONTHLY_PAYS) {
        params.push({ params: `${age}-${years}-${pay}` });
      }
    }
  }
  return params;
}

function formatWon(v: number) {
  return Math.round(v).toLocaleString("ko-KR");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ params: string }>;
}): Promise<Metadata> {
  const { params: slug } = await params;
  const [ageStr, yearsStr, payStr] = slug.split("-");
  const age = parseInt(ageStr);
  const workedYears = parseInt(yearsStr);
  const monthlyPay = parseInt(payStr);
  const result = calculateUnemployment(age, workedYears, monthlyPay * 10000);

  const title = `월급 ${monthlyPay}만원 ${workedYears}년 근무 실업급여 월 ${formatWon(result.monthlyAmount)}원 (2026) | 모두의도구`;
  const description = `${age}세, 월급 ${monthlyPay}만원, ${workedYears}년 근무 시 예상 실업급여: 일 ${formatWon(result.dailyAmount)}원, 월 ${formatWon(result.monthlyAmount)}원, 수급기간 ${result.totalDays}일, 총 수급액 ${formatWon(result.totalAmount)}원. 2026년 7월 이후 기준입니다.`;

  return {
    ...calculatorResultMetadata("/calculators/unemployment", slug),
    title,
    description,
    keywords: [
      `월급 ${monthlyPay}만원 실업급여`,
      `${workedYears}년 근무 실업급여`,
      `${age}세 실업급여`,
      `실업급여 ${monthlyPay}만원`,
      `실업급여 계산 ${workedYears}년`,
      "2026 실업급여 계산기",
      "실업급여 수급액",
      "실업급여 수급기간",
      "고용보험 실업급여",
      `${age}세 ${workedYears}년 실업급여`,
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/unemployment/${slug}`,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: `실업급여 계산기 - ${age}세 월급 ${monthlyPay}만원 ${workedYears}년 근무`,
        description,
        url: `https://modu-dogu.pages.dev/calculators/unemployment/${slug}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "KRW",
        },
      }),
    },
  };
}

export default function UnemploymentParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
