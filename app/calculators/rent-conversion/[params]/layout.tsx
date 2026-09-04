import { Metadata } from "next";
import { convertJeonseToMonthly } from "@/lib/calculations";

const JEONSE = [10000, 15000, 20000, 25000, 30000, 40000, 50000]; // 만원
const DEPOSITS = [1000, 3000, 5000]; // 만원
const RATES = [4, 4.5, 5, 5.5, 6];

function getValidCombinations() {
  const combos: { jeonse: number; deposit: number; rate: number }[] = [];
  for (const j of JEONSE) {
    for (const d of DEPOSITS) {
      if (d >= j) continue; // 보증금이 전세금보다 작아야 함
      for (const r of RATES) {
        combos.push({ jeonse: j, deposit: d, rate: r });
      }
    }
  }
  return combos;
}

export function generateStaticParams() {
  return getValidCombinations().map((c) => ({
    params: `${c.jeonse}-${c.deposit}-${c.rate}`,
  }));
}

function formatAmountLabel(manWon: number) {
  if (manWon >= 10000) return `${manWon / 10000}억`;
  if (manWon >= 1000) return `${(manWon / 1000).toFixed(manWon % 1000 === 0 ? 0 : 1)}천만`;
  return `${manWon}만`;
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
  const [jeonseStr, depositStr, rateStr] = p.split("-");
  const jeonse = parseInt(jeonseStr);
  const deposit = parseInt(depositStr);
  const rate = parseFloat(rateStr);

  const result = convertJeonseToMonthly(jeonse * 10000, deposit * 10000, rate);
  const jeonseLabel = formatAmountLabel(jeonse);
  const depositLabel = formatAmountLabel(deposit);

  const title = `전세 ${jeonseLabel}원 → 보증금 ${depositLabel}원 + 월세 ${formatWon(result.monthlyRent)}원 | 모두의도구`;
  const description = `전세 ${jeonseLabel}원을 보증금 ${depositLabel}원으로 전환 시(전환율 ${rate}%) 월세는 약 ${formatWon(result.monthlyRent)}원입니다. 전월세 전환 계산 결과.`;

  return {
    alternates: { canonical: "/calculators/rent-conversion" },
    robots: { index: false, follow: true },
    title,
    description,
    keywords: [
      `전세 ${jeonseLabel} 월세 전환`,
      `전세 ${jeonseLabel} 보증금 ${depositLabel}`,
      `전월세 전환 ${rate}%`,
      "전월세 전환 계산기",
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/rent-conversion/${p}`,
    },
  };
}

export default function RentConversionParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
