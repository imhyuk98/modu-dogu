import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "환율 계산기 - 실시간 환율 변환 (달러, 엔화, 유로, 위안)",
  description:
    "실시간 환율 기반으로 원화(KRW)와 주요 외화 간 환율을 계산할 수 있는 무료 온라인 환율 계산기입니다.",
  keywords: [
    "환율 계산기",
    "달러 환율",
    "엔화 환율",
    "유로 환율",
    "환율 변환",
    "실시간 환율",
  ],
  openGraph: {
    title: "환율 계산기 - 실시간 환율 변환 (달러, 엔화, 유로, 위안)",
    description:
      "실시간 환율 기반으로 원화(KRW)와 주요 외화 간 환율을 계산할 수 있는 무료 온라인 환율 계산기입니다.",
  },
};

export default function ExchangeRateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "환율 계산기",
            description:
              "실시간 환율 기반으로 원화(KRW)와 주요 외화 간 환율을 계산할 수 있는 무료 온라인 환율 계산기입니다.",
            url: "https://vibe-revenue.pages.dev/calculators/exchange-rate",
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
