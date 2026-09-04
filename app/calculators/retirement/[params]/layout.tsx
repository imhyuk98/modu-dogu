import { Metadata } from "next";
import { calculateRetirement } from "@/lib/calculations";

const YEARS = [1, 2, 3, 5, 7, 10, 15, 20];
const MONTHLY_PAYS = [200, 250, 300, 350, 400, 450, 500];

export function generateStaticParams() {
  const params: { params: string }[] = [];
  for (const y of YEARS) {
    for (const m of MONTHLY_PAYS) {
      params.push({ params: `${y}-${m}` });
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
  const { params: paramStr } = await params;
  const [yearsStr, monthlyPayStr] = paramStr.split("-");
  const years = parseInt(yearsStr);
  const monthlyPay = parseInt(monthlyPayStr);

  const startDate = new Date(2026 - years, 0, 1);
  const endDate = new Date(2026, 0, 1);
  const recentThreeMonthPay = monthlyPay * 10000 * 3;
  const recentThreeMonthDays = 90;

  const result = calculateRetirement(
    startDate,
    endDate,
    recentThreeMonthPay,
    recentThreeMonthDays
  );

  const retirementPayFormatted = formatWon(result.retirementPay);

  const title = `월급 ${monthlyPay}만원 ${years}년 근무 퇴직금 ${retirementPayFormatted}원 (2026) | 모두의도구`;
  const description = `2026년 기준 월급 ${monthlyPay}만원으로 ${years}년 근무 시 예상 퇴직금은 약 ${retirementPayFormatted}원입니다. 일평균임금 ${formatWon(result.averageDailyWage)}원, 총 근무일수 ${result.totalDays.toLocaleString("ko-KR")}일 기준 계산 결과입니다.`;

  return {
    alternates: { canonical: "/calculators/retirement" },
    robots: { index: false, follow: true },
    title,
    description,
    keywords: [
      `월급 ${monthlyPay}만원 퇴직금`,
      `${years}년 근무 퇴직금`,
      `월급 ${monthlyPay}만원 ${years}년 퇴직금`,
      `퇴직금 계산 ${monthlyPay}만원`,
      `${years}년차 퇴직금`,
      "2026 퇴직금 계산기",
      "퇴직금 자동계산",
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/retirement/${paramStr}`,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: `퇴직금 계산기 - 월급 ${monthlyPay}만원 ${years}년 근무`,
        description,
        url: `https://modu-dogu.pages.dev/calculators/retirement/${paramStr}`,
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

export default function RetirementParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
