import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/tdee" },
  title: "일일 칼로리(TDEE) 계산기",
  description:
    "활동량에 따른 하루 총 소비 칼로리(TDEE)를 계산합니다. 다이어트, 벌크업 목표에 맞는 칼로리를 확인하세요.",
  keywords: ["TDEE 계산기", "일일 칼로리", "기초대사량", "BMR 계산", "다이어트 칼로리"],
  openGraph: {
    images: ["/og-image.png"],
    title: "일일 칼로리(TDEE) 계산기 - 모두의도구",
    description: "활동량에 따른 하루 총 소비 칼로리(TDEE)를 계산합니다. 다이어트, 벌크업 목표에 맞는 칼로리를 확인하세요.",
    url: "https://modu-dogu.pages.dev/calculators/tdee",
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
            url: "https://modu-dogu.pages.dev/calculators/tdee",
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
