import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부동산 중개수수료 계산기 - 매매/전세/월세 중개보수 자동 계산",
  description:
    "2025년 기준 부동산 중개수수료(중개보수)를 자동으로 계산합니다. 매매, 전세, 월세 거래 유형별 요율과 한도를 적용하여 정확한 중개수수료를 확인하세요.",
  keywords: [
    "중개수수료 계산기",
    "부동산 중개보수",
    "복비 계산기",
    "매매 중개수수료",
    "전세 중개수수료",
    "월세 중개수수료",
    "부동산 복비",
    "2025 중개수수료",
  ],
  openGraph: {
    title: "부동산 중개수수료 계산기 - 매매/전세/월세 중개보수 자동 계산",
    description:
      "2025년 기준 매매, 전세, 월세 거래 유형별 부동산 중개수수료를 자동으로 계산합니다.",
  },
};

export default function BrokerageFeeLayout({
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
            name: "부동산 중개수수료 계산기",
            description:
              "2025년 기준 부동산 중개수수료(중개보수)를 자동으로 계산합니다. 매매, 전세, 월세 거래 유형별 요율과 한도를 적용합니다.",
            url: "https://vibe-revenue.pages.dev/calculators/brokerage-fee",
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
