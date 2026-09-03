import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 식단 추천 계산기",
  description:
    "AI가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
  keywords: ["AI 식단 추천", "식단 계산기", "탄단지 비율", "다이어트 식단", "벌크업 식단", "TDEE 계산", "AI 맞춤 식단"],
  openGraph: {
    title: "AI 식단 추천 계산기 - 모두의도구",
    description: "AI가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/macro-diet",
  },
};

export default function MacroDietLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI 식단 추천 계산기",
            description:
              "AI가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
            url: "https://modu-dogu.pages.dev/calculators/macro-diet",
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
