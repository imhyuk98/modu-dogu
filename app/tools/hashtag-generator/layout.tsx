import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/hashtag-generator" },
  title: "AI 인스타 해시태그 생성기 - 인스타그램 해시태그 추천",
  description:
    "카테고리와 분위기를 선택하면 인스타그램 인기 해시태그를 자동으로 추천합니다. 음식, 카페, 여행, 일상, 패션, 뷰티 등 500개 이상의 해시태그 데이터베이스에서 최적의 해시태그 조합을 생성하세요.",
  keywords: [
    "인스타 해시태그",
    "해시태그 추천",
    "인스타그램 해시태그",
    "해시태그 생성기",
    "인스타 태그",
    "인스타그램 태그 추천",
    "해시태그 자동 생성",
    "인스타 인기 태그",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 인스타 해시태그 생성기 - 인스타그램 해시태그 추천",
    description:
      "카테고리와 분위기를 선택하면 인스타그램 인기 해시태그를 자동으로 추천합니다. 500개 이상의 해시태그 DB에서 최적의 조합을 생성!",
    url: "https://modu-dogu.pages.dev/tools/hashtag-generator",
  },
};

export default function HashtagGeneratorLayout({
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
            name: "AI 인스타 해시태그 생성기",
            description:
              "카테고리와 분위기를 선택하면 인스타그램 인기 해시태그를 자동으로 추천합니다. 500개 이상의 해시태그 데이터베이스.",
            url: "https://modu-dogu.pages.dev/tools/hashtag-generator",
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
