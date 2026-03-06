import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일일 칼로리(TDEE) 계산기 - 계산기나라",
  description:
    "활동량에 따른 하루 총 소비 칼로리(TDEE)를 계산합니다. 다이어트, 벌크업 목표에 맞는 칼로리를 확인하세요.",
  keywords: ["TDEE 계산기", "일일 칼로리", "기초대사량", "BMR 계산", "다이어트 칼로리"],
  openGraph: {
    title: "일일 칼로리(TDEE) 계산기 - 계산기나라",
    description: "활동량에 따른 하루 총 소비 칼로리(TDEE)를 계산합니다. 다이어트, 벌크업 목표에 맞는 칼로리를 확인하세요.",
    url: "https://vibe-revenue.pages.dev/calculators/tdee",
  },
};

export default function TDEELayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "일일 칼로리(TDEE) 계산기",
            description:
              "활동량에 따른 하루 총 소비 칼로리(TDEE)를 계산합니다. 다이어트, 벌크업 목표에 맞는 칼로리를 확인하세요.",
            url: "https://vibe-revenue.pages.dev/calculators/tdee",
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
