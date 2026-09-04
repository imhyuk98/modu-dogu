import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/movie-recommendation" },
  title: "AI 영화 추천 - 기분별 맞춤 영화 추천",
  description:
    "AI가 기분, 장르, 국가, 플랫폼을 분석하여 맞춤 영화를 추천합니다. 넷플릭스, 왓챠, 디즈니+ 등 플랫폼별 영화 추천과 기분별 영화 추천을 무료로 이용하세요.",
  keywords: [
    "AI 영화 추천",
    "영화 추천",
    "넷플릭스 추천",
    "왓챠 추천",
    "오늘 볼 영화",
    "기분별 영화 추천",
    "장르별 영화 추천",
    "디즈니플러스 추천",
    "영화 추천 사이트",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 영화 추천 - 기분별 맞춤 영화 추천",
    description:
      "AI가 기분, 장르, 국가, 플랫폼을 분석하여 맞춤 영화를 추천합니다. 넷플릭스, 왓챠, 디즈니+ 등 플랫폼별 영화 추천을 무료로 이용하세요.",
    url: "https://modu-dogu.pages.dev/tools/movie-recommendation",
  },
};

export default function MovieRecommendationLayout({
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
            name: "AI 영화 추천",
            description:
              "AI가 기분, 장르, 국가, 플랫폼을 분석하여 맞춤 영화를 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/movie-recommendation",
            applicationCategory: "EntertainmentApplication",
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
