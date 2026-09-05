import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/movie-recommendation" },
  title: "영화 추천 도우미 - 기분별 맞춤 영화 추천",
  description:
    "기분, 장르, 국가와 상영시간을 골라 저장 목록에서 영화를 추천받으세요. OTT 표시는 2026-03-06에 정리한 참고값이며 현재 제공 여부는 각 서비스에서 확인해야 합니다.",
  keywords: [
    "영화 추천 도우미",
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
    title: "영화 추천 도우미 - 기분별 맞춤 영화 추천",
    description:
      "기분, 장르, 국가와 상영시간을 골라 저장 목록에서 영화를 추천받으세요. OTT 표시는 2026-03-06에 정리한 참고값입니다.",
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
            name: "영화 추천 도우미",
            description:
              "도구가 기분, 장르, 국가, 플랫폼을 분석하여 맞춤 영화를 추천합니다.",
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
