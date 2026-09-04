import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/brokerage-fee" },
  title: "부동산 중개수수료 계산기 - 매매/전세/월세 중개보수 자동 계산",
  description:
    "2026년 확인 주택 중개보수 상한요율로 매매, 전세, 월세 비용을 간이 계산합니다. 월세 5천만원 미만 환산식과 한도액을 반영합니다.",
  keywords: [
    "중개수수료 계산기",
    "부동산 중개보수",
    "복비 계산기",
    "매매 중개수수료",
    "전세 중개수수료",
    "월세 중개수수료",
    "부동산 복비",
    "2026 중개수수료",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "부동산 중개수수료 계산기 - 매매/전세/월세 중개보수 자동 계산",
    description:
      "2026년 확인 상한요율로 매매, 전세, 월세 부동산 중개보수를 간이 계산합니다.",
    url: "https://modu-dogu.pages.dev/calculators/brokerage-fee",
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
              "2026년 확인 주택 중개보수 상한요율로 매매, 전세, 월세 거래 비용을 간이 계산합니다.",
            url: "https://modu-dogu.pages.dev/calculators/brokerage-fee",
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
