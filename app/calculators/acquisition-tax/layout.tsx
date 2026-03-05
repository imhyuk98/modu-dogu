import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부동산 취득세 계산기 - 주택 취득세/농어촌특별세/지방교육세 자동 계산",
  description:
    "2025년 기준 주택 취득세를 자동으로 계산합니다. 주택 수, 조정대상지역 여부, 면적에 따른 취득세, 농어촌특별세, 지방교육세를 확인하세요.",
  keywords: [
    "취득세 계산기",
    "부동산 취득세",
    "주택 취득세",
    "다주택 취득세",
    "조정대상지역 취득세",
    "농어촌특별세",
    "지방교육세",
    "2025 취득세",
  ],
  openGraph: {
    title: "부동산 취득세 계산기 - 주택 취득세/농어촌특별세/지방교육세 자동 계산",
    description:
      "2025년 기준 주택 수, 조정대상지역 여부에 따른 취득세를 자동으로 계산합니다.",
  },
};

export default function AcquisitionTaxLayout({
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
            name: "부동산 취득세 계산기",
            description:
              "2025년 기준 주택 취득세를 자동으로 계산합니다. 주택 수, 조정대상지역 여부, 면적에 따른 취득세, 농어촌특별세, 지방교육세를 확인합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/acquisition-tax",
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
