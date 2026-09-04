import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/book-recommendation" },
  title: "책 추천 도우미 - 기분별 맞춤 도서 추천",
  description:
    "도구가 기분, 장르, 독서 수준, 분량, 연령대를 분석하여 맞춤 도서를 추천합니다. 베스트셀러부터 숨은 명작까지, 지금 읽기 좋은 책을 찾아보세요.",
  keywords: [
    "책 추천 도우미",
    "책 추천",
    "도서 추천",
    "베스트셀러",
    "읽을 만한 책",
    "기분별 책 추천",
    "맞춤 도서 추천",
    "한국 소설 추천",
    "자기계발 책 추천",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "책 추천 도우미 - 기분별 맞춤 도서 추천",
    description:
      "도구가 기분, 장르, 독서 수준, 분량, 연령대를 분석하여 맞춤 도서를 추천합니다. 베스트셀러부터 숨은 명작까지!",
    url: "https://modu-dogu.pages.dev/tools/book-recommendation",
  },
};

export default function BookRecommendationLayout({
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
            name: "책 추천 도우미",
            description:
              "도구가 기분, 장르, 독서 수준, 분량, 연령대를 분석하여 맞춤 도서를 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/book-recommendation",
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
