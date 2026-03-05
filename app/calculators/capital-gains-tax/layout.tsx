import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "양도소득세 계산기 - 부동산 양도세/장기보유특별공제 자동 계산",
  description:
    "2025년 기준 부동산 양도소득세를 자동으로 계산합니다. 장기보유특별공제, 기본공제, 종합소득세율을 적용하여 양도소득세와 지방소득세를 확인하세요.",
  keywords: [
    "양도소득세 계산기",
    "부동산 양도세",
    "양도차익 계산",
    "장기보유특별공제",
    "1세대 1주택 비과세",
    "양도세 세율",
    "2025 양도소득세",
  ],
  openGraph: {
    title: "양도소득세 계산기 - 부동산 양도세/장기보유특별공제 자동 계산",
    description:
      "2025년 기준 부동산 양도소득세를 장기보유특별공제 등을 적용하여 자동으로 계산합니다.",
  },
};

export default function CapitalGainsTaxLayout({
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
            name: "양도소득세 계산기",
            description:
              "2025년 기준 부동산 양도소득세를 자동으로 계산합니다. 장기보유특별공제, 기본공제, 종합소득세율을 적용합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/capital-gains-tax",
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
