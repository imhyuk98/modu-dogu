import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/exchange-rate" },
  title: "환율 계산기 - 최신 기준환율 변환 (달러, 엔화, 유로, 위안)",
  description:
    "평일 하루 한 번 갱신되는 최근 기준환율로 원화(KRW)와 주요 외화 간 금액을 계산하는 무료 환율 계산기입니다.",
  keywords: [
    "환율 계산기",
    "달러 환율",
    "엔화 환율",
    "유로 환율",
    "환율 변환",
    "실시간 환율",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "환율 계산기 - 최신 기준환율 변환 (달러, 엔화, 유로, 위안)",
    description:
      "평일 하루 한 번 갱신되는 최근 기준환율로 원화(KRW)와 주요 외화 간 금액을 계산하는 무료 환율 계산기입니다.",
    url: "https://modu-dogu.pages.dev/calculators/exchange-rate",
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
              "평일 하루 한 번 갱신되는 최근 기준환율로 원화(KRW)와 주요 외화 간 금액을 계산하는 무료 환율 계산기입니다.",
            url: "https://modu-dogu.pages.dev/calculators/exchange-rate",
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
