import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/macro-diet" },
  title: "식단 구성 도우미 계산기",
  description:
    "도구가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
  keywords: ["식단 구성 도우미", "식단 계산기", "탄단지 비율", "다이어트 식단", "벌크업 식단", "TDEE 계산", "조건별 맞춤 식단"],
  openGraph: {
    images: ["/og-image.png"],
    title: "식단 구성 도우미 계산기 - 모두의도구",
    description: "도구가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
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
            name: "식단 구성 도우미 계산기",
            description:
              "도구가 체형과 목표에 맞는 탄단지 비율과 한식 식단을 추천합니다. 다이어트, 벌크업, 체중 유지 맞춤 식단을 확인하세요.",
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
