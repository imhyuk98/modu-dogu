import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/inflation" },
  title: "인플레이션 계산기 - 물가상승률에 따른 화폐가치 변화 계산",
  description:
    "연간 물가상승률(인플레이션)에 따른 미래 물가와 현재 돈의 실질 구매력 변화를 계산합니다. 연도별 가치 변화 테이블로 한눈에 확인하세요.",
  keywords: [
    "인플레이션 계산기",
    "물가상승률 계산",
    "구매력 계산기",
    "화폐가치 계산",
    "물가 계산기",
    "실질 구매력",
    "인플레이션율",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "인플레이션 계산기 - 물가상승률에 따른 화폐가치 변화 계산",
    description:
      "인플레이션에 따른 미래 물가와 현재 돈의 실질 구매력을 자동으로 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/inflation",
  },
};

export default function InflationLayout({
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
            name: "인플레이션 계산기",
            description:
              "연간 물가상승률(인플레이션)에 따른 미래 물가와 현재 돈의 실질 구매력 변화를 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/inflation",
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
