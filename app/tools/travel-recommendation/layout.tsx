import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/travel-recommendation" },
  title: "여행지 추천 도우미 - 맞춤 국내외 여행지 추천",
  description:
    "도구가 여행 스타일, 동행, 계절, 기간, 예산을 분석하여 최적의 국내외 여행지를 추천합니다. 100곳 이상의 여행지 데이터베이스로 나만의 맞춤 여행지를 찾아보세요.",
  keywords: [
    "여행지 추천 도우미",
    "여행지 추천",
    "국내 여행",
    "해외 여행",
    "여행 계획",
    "맞춤 여행지",
    "여행지 검색",
    "국내 여행지 추천",
    "해외 여행지 추천",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "여행지 추천 도우미 - 맞춤 국내외 여행지 추천",
    description:
      "도구가 여행 스타일, 동행, 계절, 기간, 예산을 분석하여 최적의 국내외 여행지를 추천합니다.",
    url: "https://modu-dogu.pages.dev/tools/travel-recommendation",
  },
};

export default function TravelRecommendationLayout({
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
            name: "여행지 추천 도우미",
            description:
              "도구가 여행 스타일, 동행, 계절, 기간, 예산을 분석하여 최적의 국내외 여행지를 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/travel-recommendation",
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
