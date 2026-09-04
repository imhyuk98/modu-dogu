import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/gift-recommendation" },
  title: "AI 선물 추천 - 상황별 맞춤 선물 추천",
  description:
    "AI가 받는 사람, 상황, 예산, 취향을 분석하여 최적의 선물을 추천합니다. 생일, 크리스마스, 기념일, 졸업, 승진 등 모든 상황에 맞는 선물을 찾아보세요.",
  keywords: [
    "AI 선물 추천",
    "선물 추천",
    "생일 선물",
    "크리스마스 선물",
    "기념일 선물",
    "부모님 선물",
    "선물 추천 사이트",
    "맞춤 선물",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 선물 추천 - 상황별 맞춤 선물 추천",
    description:
      "AI가 받는 사람, 상황, 예산, 취향을 분석하여 최적의 선물을 추천합니다. 모든 상황에 맞는 선물을 찾아보세요.",
    url: "https://modu-dogu.pages.dev/tools/gift-recommendation",
  },
};

export default function GiftRecommendationLayout({
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
            name: "AI 선물 추천",
            description:
              "AI가 받는 사람, 상황, 예산, 취향을 분석하여 최적의 선물을 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/gift-recommendation",
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
