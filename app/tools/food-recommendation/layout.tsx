import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/food-recommendation" },
  title: "AI 오늘 뭐 먹지 - 메뉴 추천, 점심 메뉴 고민 해결",
  description:
    "AI가 기분, 날씨, 인원, 예산을 분석하여 오늘의 메뉴를 추천합니다. 점심 메뉴 고민, 저녁 뭐 먹지 고민을 한 번에 해결하세요. 150가지 이상의 메뉴 데이터베이스에서 맞춤 추천!",
  keywords: [
    "오늘 뭐 먹지",
    "메뉴 추천",
    "점심 메뉴",
    "저녁 메뉴",
    "AI 음식 추천",
    "랜덤 메뉴",
    "메뉴 추천 사이트",
    "점심 메뉴 추천",
    "야식 추천",
    "혼밥 메뉴",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 오늘 뭐 먹지 - 메뉴 추천, 점심 메뉴 고민 해결",
    description:
      "AI가 기분, 날씨, 인원, 예산을 분석하여 오늘의 메뉴를 추천합니다. 150가지 이상의 메뉴에서 맞춤 추천!",
    url: "https://modu-dogu.pages.dev/tools/food-recommendation",
  },
};

export default function FoodRecommendationLayout({
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
            name: "AI 오늘 뭐 먹지 - 메뉴 추천",
            description:
              "AI가 기분, 날씨, 인원, 예산을 분석하여 오늘의 메뉴를 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/food-recommendation",
            applicationCategory: "LifestyleApplication",
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
