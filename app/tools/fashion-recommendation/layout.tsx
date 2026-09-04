import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/fashion-recommendation" },
  title: "AI 패션 코디 추천 - 오늘 뭐 입지, 상황별 코디",
  description:
    "AI가 성별, 체형, 상황, 날씨, 스타일을 분석하여 최적의 패션 코디를 추천합니다. 출근 코디, 데이트 코디, 소개팅 코디, 면접 코디 등 상황별 맞춤 코디를 확인하세요.",
  keywords: [
    "AI 코디 추천",
    "오늘 뭐 입지",
    "패션 코디",
    "옷 추천",
    "데이트 코디",
    "출근 코디",
    "소개팅 코디",
    "면접 코디",
    "코디 추천 사이트",
    "상황별 코디",
  ],
  openGraph: {
    images: ["/og-image.png"],
    title: "AI 패션 코디 추천 - 오늘 뭐 입지, 상황별 코디",
    description:
      "AI가 성별, 체형, 상황, 날씨, 스타일을 분석하여 최적의 패션 코디를 추천합니다. 상황별 맞춤 코디를 확인하세요.",
    url: "https://modu-dogu.pages.dev/tools/fashion-recommendation",
  },
};

export default function FashionRecommendationLayout({
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
            name: "AI 패션 코디 추천",
            description:
              "AI가 성별, 체형, 상황, 날씨, 스타일을 분석하여 최적의 패션 코디를 추천합니다.",
            url: "https://modu-dogu.pages.dev/tools/fashion-recommendation",
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
